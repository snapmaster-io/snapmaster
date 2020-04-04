import React, { useState } from 'react'
import { useApi } from '../../utils/api'
import { navigate } from 'hookrouter'
import { useConnections } from '../../utils/connections'
import { Button, Card } from 'react-bootstrap'
import SnapParametersEditor from './SnapParametersEditor'

const ActivateTab = ({snap}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [refresh, setRefresh] = useState(false);

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
    if (error || !response.ok) {
      return;
    }

    // turn off the spinner
    setRefresh(false);

    // navigate back to active snaps
    navigate('/snaps/active');
  }

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
  const disableActivateFlag = actionProviders && actionProviders.filter(p => !p.connected).length > 0;

  return (
    disableActivateFlag ? 
      <h5>Before activating a snap, please connect all the tools it references</h5> :
      <Card>
        <Card.Body>
          <SnapParametersEditor params={snap && snap.parameters} />
          <Button variant="primary" style={{ marginTop: 10 }} onClick={ activate }>
            <i className={`fa fa-${refresh ? 'spinner' : 'play'}`} />&nbsp;&nbsp;Activate
          </Button>
        </Card.Body>
      </Card>
  )
}

export default ActivateTab
