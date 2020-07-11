import React, { useState, useCallback, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { CardDeck, Card, InputGroup, FormControl, Modal, Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import HighlightCard from '../components/HighlightCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ActionCard from '../components/ActionCard';

const MyActionsPage = () => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const [myActions, setMyActions] = useState();
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [valid, setValid] = useState();
  const [url, setUrl] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState();  
  const pageTitle = 'My Actions';
  const docsUrl = 'https://doc.snapmaster.io/';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('actions');

      if (error || !response.ok) {
        setLoading(false);
        setMyActions(null);
        return;
      }
  
      const item = await response.json();      
      if (!item || item.error) {
        setMessage(`Error: ${item && item.message}; try refreshing`);
      } else {
        setMyActions(item && item.data);
      }

      setLoading(false);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // check for an error message
  if (message) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText={message} />
    )    
  }
  
  // if the service is down, show the banner
  if (!loading && !myActions) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  const handleDelete = async (e, actionId) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    // post the delete request to the snaps endpoint
    const request = {
      action: 'delete',
      actionId: actionId
    };

    const [response, error] = await post('actions', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    const newActions = myActions.filter(a => a.actionId !== actionId);
    setMyActions(newActions);
  }

  const save = async () => {
    // post the fork request to the snaps endpoint
    const request = {
      action: 'create',
      definition: action.text,
      url: url
    };

    const [response, error] = await post('actions', JSON.stringify(request));
    if (error || !response.ok) {      
      return;
    } 

    const item = await response.json();
    if (item && !item.error && item.data && item.data.actionId) {
      navigate(`/snaps/actions/${item.data.actionId}`);
    } else {
      setError(item.message);
      setShowErrorModal(true);
      return;
    }
  }

  const validate = async () => {
    try {
      const actionUrl = url.endsWith('__metadata') ? url : 
        url.endsWith('/') ? `${url}__metadata` : `${url}/__metadata`;
      const response = await fetch(actionUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });      
  
      const data = await response.json();
      if (data && data.name && data.version.startsWith('actions-v')) {
        setValid('valid');
        setAction(data);
      }  
    } catch (error) {
      setValid('invalid');
      setAction(null);
    }
  }

  const actions = myActions && myActions.map(a => {
      const [userId, name] = a.actionId.split('/');
      return {
        actionId: a.actionId,
        userId: userId,
        name: name,
        description: a.description,
        provider: a.provider,
        actions: a.actions,
        url: a.url
      }
    });

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>    

      <CardDeck>
        { actions && 
          actions.map(action => 
            <ActionCard 
              key={action.actionId} 
              action={action} 
              currentUser={user.sub} 
              deleteAction={(e) => handleDelete(e, action.actionId)}
            />)
        }
        { myActions && 
          <HighlightCard className="text-center" onClick={() => setShowAddModal(true)}
            key='add' 
            style={{ minWidth: '230px', maxWidth: '230px', minHeight: '230px', maxHeight: '230px' }}>
            <Card.Header style={{ minHeight: 60 }}>Add action from URL</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>
        }
      </CardDeck>

      <Modal show={showAddModal} dialogClassName="modal-90w" onHide={ () => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add an Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Actions are self-describing - they have a GET /__metadata endpoint that returns 
            the action definition.  Enter the base URL for the action below, and then select 
            "Validate" to check whether the endpoint represents a valid Action.  
          </h5>
          <h5>
            To create a valid action, follow the <a href={docsUrl} target='_smdocs'>Action docs</a>.
          </h5>
          <br />
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Action URL</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="url"
              aria-describedby="inputGroup-sizing-default"
              value={url}
              onChange={(e) => { setUrl(e.target.value) }}
            />
            &nbsp;&nbsp;
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                { valid === 'valid' && <span><i className="fa fa-check text-success" />&nbsp;&nbsp;actions found!</span> }
                { valid === 'invalid' && <span><i className="fa fa-times text-danger" />&nbsp;&nbsp;metadata not found</span> }
                { !valid && <span><i className="fa fa-times text-danger" />&nbsp;&nbsp;validate the url</span> }
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={validate}>
            Validate
          </Button>
          <Button variant="primary" disabled={valid !== 'valid'} onClick={save}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={ () => setShowErrorModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { error }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => setShowErrorModal(false) }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MyActionsPage