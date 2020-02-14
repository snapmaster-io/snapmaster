import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import HighlightCard from '../components/HighlightCard'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const ConnectionsPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const { user, loginWithRedirect } = useAuth0();
  const { post } = useApi();
  const [errorMessage, setErrorMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [linkProvider, setLinkProvider] = useState();
  const pageTitle = 'Reputation sources';

  // if in the middle of a loading loop, put up loading banner and bail
  if (!connections && loading) {
    return <Loading />
  }

  if (connections && connections.find) {
    errorMessage && setErrorMessage(null);
  } else {
    !errorMessage && setErrorMessage("Can't reach service - try refreshing later");
  }

  // call the link / unlink user API
  const call = async (action, primaryUserId, secondaryUserId) => { 
    try {
      const body = JSON.stringify({ 
        action: action,
        primaryUserId: primaryUserId,
        secondaryUserId: secondaryUserId 
      });

      const [response, error] = await post('link', body);
      if (error || !response.ok) {
        return;
      }

      const responseData = await response.json();
      const success = responseData && responseData.message === 'success';

      // if linking was successful, re-login with primary account
      if (action === 'link' && success) {
        const [provider] = primaryUserId.split('|');
        // log back in with the primary account 
        loginWithRedirect({
          access_type: 'offline', 
          connection: provider,
          redirect_uri: `${window.location.origin}`
        });
      } else {
        // refresh the page
        loadConnections();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };  

  // start the account linking process
  // linking state machine: null => linking => login => null
  const link = (provider) => { 
    // move the state machine from null to 'linking'
    localStorage.setItem('linking', 'linking');
    // store the currently logged in userid (will be used as primary)
    localStorage.setItem('primary', user.sub);
    // store the provider being connected to
    localStorage.setItem('provider', provider);

    // need to sign in with new IdP
    loginWithRedirect({
      access_type: 'offline', 
      connection: provider,
      redirect_uri: `${window.location.origin}`
    });
  }

  // get the state of the linking state machine
  const linking = localStorage.getItem('linking');
  if (linking === 'linking') {
    // move the state machine from 'linking' to 'login'
    localStorage.setItem('linking', 'login');
    const primaryUserId = localStorage.getItem('primary');

    // link the accounts
    call('link', primaryUserId, user.sub);
  }

  // add or remove a simple connection
  const processConnection = async (action, provider) => {
    const body = JSON.stringify({ action: action, provider: provider });
    const [response, error] = await post('connections', body);
    if (error || !response.ok) {
      return;
    }

    const responseData = await response.json();
    const success = responseData && responseData.message === 'success';
    if (success) {
      loadConnections();
    }
  }

  const connectedSources = connections && connections.filter(c => c.connected);
  const nonConnectedSources = connections && connections.filter(c => !c.connected);

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <h4 className="page-title">{pageTitle}</h4>
      </div>
      { 
        connections && connections.map ? 
        <div>
          <CardDeck>
            <Card border="success" style={{ 
              minWidth: connectedSources.length * 180,
              maxWidth: connectedSources.length * 180,
              marginBottom: 10
            }}>
              <Card.Header>Connected</Card.Header>
              <Card.Body>
                <CardDeck>
                {
                  connectedSources.map((connection, key) => {
                    // set up some variables
                    const connected = connection.connected;
                    const uid = `${connection.provider}|${connection.userId}`;
                    const connectionTitle = connection.provider.split('-')[0];
                    return (
                      <HighlightCard 
                        key={key} 
                        style={{ maxWidth: '150px', textAlign: 'center' }}>
                        <Card.Body 
                          onClick= { () => connectionTitle && navigate(`/sources/${connectionTitle}` )}>
                          <Card.Img variant="top" src={connection.image} style={{ width: '6rem' }}/>
                        </Card.Body>
                        <Card.Footer>
                        { 
                          connected === 'base' && 
                            <center className='text-success' style={{marginTop: 7, marginBottom: 7}}>Main Login</center>
                        }
                        { 
                          connected !== 'base' && connection.type === 'link' &&
                            <Button variant='danger' onClick={ () => { call('unlink', null, uid) } }>Disconnect</Button>
                        }
                        { 
                          connected !== 'base' && connection.type === 'simple' &&
                            <Button variant='danger' onClick={ () => { processConnection('remove', connection.provider) } }>Disconnect</Button>
                        }
                        </Card.Footer>
                      </HighlightCard>
                    )
                  })
                }
                </CardDeck>
              </Card.Body>
            </Card>

            <Card border="danger" style={{ 
              minWidth: nonConnectedSources.length * 180,
              maxWidth: nonConnectedSources.length * 180,
              marginBottom: 10
            }}>
              <Card.Header>Not connected</Card.Header>
              <Card.Body>
                <CardDeck>
                {
                  // filter for all the non-connected sources
                  nonConnectedSources.map((connection, key) => {
                    // set up the link action
                    const action = () => { 
                      setLinkProvider(connection.provider); 
                      setShowModal(true);
                    };

                    return (
                      <Card 
                        key={key} 
                        style={{ maxWidth: '150px', textAlign: 'center' }}>
                        <Card.Body> 
                          <Card.Img variant="top" src={connection.image} style={{ width: '6rem' }}/>
                        </Card.Body>
                        <Card.Footer>
                          { 
                            connection.type === 'link' &&
                              <Button variant='primary' onClick={action}>Connect</Button>
                          }
                          { 
                            connection.type === 'simple' &&
                              <Button variant='primary' onClick={ () => { processConnection('add', connection.provider) } }>Connect</Button>
                          }
                        </Card.Footer>
                      </Card>
                    )
                  })
                }
                </CardDeck>
              </Card.Body>
            </Card>
          </CardDeck>

          <Modal show={showModal} onHide={ () => setShowModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Linking a new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              To connect to {linkProvider} as a new reputation source, you will need to login  
              to {linkProvider} and allow SaaS Master access to your data.  
              </p>
              <p>
              Note that once your approve these permissions, you will be 
              asked to log in again with your primary login.
              </p>
              <p>
              At the end of the process, you will see data from {linkProvider} as one of your   
              reputation sources!
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => link(linkProvider) }>
                Link
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        : errorMessage ? 
        <div>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;{errorMessage}</span>
        </div>
        :
        <div />
      }
    </div>
  )
}

export default ConnectionsPage