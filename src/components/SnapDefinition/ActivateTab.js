import React, { useState } from 'react'
import { useApi } from '../../utils/api'
import { navigate } from 'hookrouter'
import { useConnections } from '../../utils/connections'
import { Button, Card, Modal } from 'react-bootstrap'
import SnapParametersEditor from './SnapParametersEditor'

const ActivateTab = ({snap}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();

  const snapId = snap && snap.snapId;

  const activate = async () => {
    // set the spinner
    setRefresh(true);

    // post a request to the activesnaps endpoint
    const request = {
      action: 'activate',
      snapId: snapId,
      params: snap.parameters
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));

    // turn off the spinner
    setRefresh(false);

    if (error || !response.ok) {
      return;
    }

    const item = await response.json();
    if (!item || item.error) {
      const message = (item && item.message) || 'could not activate snap';
      setError(message);
      setShowModal(true);
      return;
    }

    // retrieve active snap ID
    const activeSnap = item.data;
    const activeSnapId = activeSnap.activeSnapId;
    if (activeSnapId) {
      // navigate to the activated snap
      navigate(`/snaps/${snapId}/${activeSnapId}`);
    } else {
      // navigate back to active snaps
      navigate('/snaps/active');
    }
  }

  // get the trigger and trigger provider
  const trigger = snap && snap.trigger && snap.config && snap.config.find(c => c.name === snap.trigger);
  const triggerProvider = trigger && connections && connections.find(el => el.provider === trigger.provider);

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return actionConfig.provider;
  });

  const actionProviders = actionList && actionList.map(a => { 
    const actionProvider = connections && connections.find(el => el.provider === a);
    return actionProvider;
  });

  // if one of the providers ins't connected, the activate tab should be disabled
  const disableActivateFlag = !triggerProvider || !triggerProvider.connected || !actionProviders || actionProviders.filter(p => !p.connected).length > 0;

  return (
    disableActivateFlag ? 
      <h5>Before activating a snap, please connect all the tools it references</h5> :
      <div>
        <Card>
          <Card.Body>
            <SnapParametersEditor params={snap && snap.parameters} />
            <Button variant="primary" style={{ marginTop: 10 }} onClick={ activate }>
              <i className={`fa fa-${refresh ? 'spinner' : 'play'}`} />&nbsp;&nbsp;Activate
            </Button>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={ () => setShowModal(false) }>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          { error }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={ () => setShowModal(false) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default ActivateTab
