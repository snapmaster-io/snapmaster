import React, { useState } from 'react'
import { useApi } from '../../utils/api'
import { navigate } from 'hookrouter'
import { Button, Card, Modal } from 'react-bootstrap'
import Highlight from '../Highlight'

const ActiveSnapActions = ({activeSnap, setActiveSnap}) => {
  const { post } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [showTriggerDataModal, setShowTriggerDataModal] = useState(false);
  const [showDanger, setShowDanger] = useState();
  const [error, setError] = useState();
  const [refresh, setRefresh] = useState();

  const activeSnapId = activeSnap && activeSnap.activeSnapId;

  const displayIcon = (icon) => refresh === icon ? 'spinner' : icon

  const invokeAction = async (action, activeSnapId, icon) => {
    // set the spinner
    setRefresh(icon);

    // post the action request to the activesnaps endpoint
    const request = {
      action,
      snapId: activeSnapId
    };    
    const [response, error] = await post('activesnaps', JSON.stringify(request));

    // reset the spinner
    setRefresh(null);

    if (error || !response.ok) {
      return;
    }

    const item = await response.json();  
    if (!item || item.error) {
      setError(item.message);
      setShowModal(true);
      return;
    }

    if (action === 'deactivate') {
      navigate('/snaps/active');
      return;
    }

    // a successful invocation will send a refreshed activeSnap
    if (item.data) {
      setActiveSnap(item.data);
    }
  }

  const test = () => {
    post(`activesnaps/${activeSnapId}`);
    // TODO: check for errors, display them before navigating to logs
    
    navigate(`/snaps/logs/${activeSnapId}`);
  }

  return (
    <div>
      <h5 style={{ margin: 10 }}>{activeSnap && 'Actions:'}</h5>
      <Card>
        <Card.Body>
          <div style={{ display: 'flex' }}>
            <Button className="btn" onClick={ () => navigate(`/snaps/logs/${activeSnapId}`)}>
              <i className="fa fa-book" />&nbsp;&nbsp;Logs
            </Button>
            { activeSnap.state === 'active' &&
            <Button style={{ marginLeft: 20, width: 105 }} className="btn btn-warning" onClick={ () => invokeAction('pause', activeSnapId, 'pause')}>
              &nbsp;<i className={`fa fa-${displayIcon('pause')}`} />&nbsp;&nbsp;Pause&nbsp;
            </Button>
            }
            { activeSnap.state === 'paused' &&
            <Button style={{ marginLeft: 20, width: 105 }} className="btn btn-success" onClick={ () => invokeAction('resume', activeSnapId, 'play')}>
              <i className={`fa fa-${displayIcon('play')}`} />&nbsp;&nbsp;Resume
            </Button>
            }        
            <Button style={{ marginLeft: 20 }} onClick={test}>
              <i className="fa fa-flash"></i>&nbsp;&nbsp;Test&nbsp;
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={() => setShowTriggerDataModal(true)}>
              <i className="fa fa-info-circle"></i>&nbsp;&nbsp;Trigger Info&nbsp;
            </Button>
            <Button style={{ marginLeft: 20 }} className="btn btn-danger" onClick={ () => setShowDanger(true) }>
              <i className={`fa fa-${displayIcon('remove')}`} />&nbsp;&nbsp;Deactivate
            </Button>
          </div>
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

      <Modal show={showTriggerDataModal} onHide={ () => setShowTriggerDataModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Trigger Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { activeSnap && <Highlight>{JSON.stringify(activeSnap.triggerData, null, 2)}</Highlight> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => setShowTriggerDataModal(false) }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDanger} onHide={ () => setShowDanger(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to deactivate?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Deactivating an active snap will remove all traces of it, including logs of 
          prior runs.  Please confirm you'd like to deactivate instead of just pausing the snap.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => setShowDanger(false) }>
            Cancel
          </Button>
          <Button variant="primary" onClick={ () => { setShowDanger(false); invokeAction('deactivate', activeSnapId, 'remove'); } }>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ActiveSnapActions
