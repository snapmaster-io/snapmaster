import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { Card, CardDeck, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle';

const LibraryPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const { user, loginWithRedirect } = useAuth0();
  const { post } = useApi();
  const [errorMessage, setErrorMessage] = useState();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [providerToConnect, setProviderToConnect] = useState();
  const pageTitle = 'Tool Library';

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
  const processConnection = async (action, providerName) => {
    const provider = connections.find(c => c.provider === providerName);
    const connectionInfo = provider.definition.connection.connectionInfo;

    const body = JSON.stringify({ action: action, provider: providerName, connectionInfo: connectionInfo });
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

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        connections && connections.map ? 
        <div>
          <CardDeck>
          {
            connections.map((tool, key) => {
              // set up the link action
              const linkAction = () => { 
                setProviderToConnect(tool.provider); 
                setShowLinkModal(true);
              };

              // set up the connect action
              const connectAction = () => { 
                setProviderToConnect(tool.provider); 
                setShowSimpleModal(true);
              };

              return (
                <Card 
                  key={key} 
                  style={{ 
                    maxWidth: '150px', 
                    minWidth: '150px', 
                    marginBottom: '30px',
                    textAlign: 'center' 
                  }}>
                  <Card.Body> 
                    <Card.Img variant="top" src={tool.image} style={{ width: '6rem' }}/>
                  </Card.Body>
                  <Card.Footer>
                    { 
                      !tool.connected && tool.type === 'link' &&
                        <Button variant='primary' onClick={linkAction}>Connect</Button>
                    }
                    { 
                      !tool.connected && tool.type === 'simple' &&
                        <Button variant='primary' onClick={connectAction}>Connect</Button>
                    }
                    { 
                      tool.connected && <center className='text-success' style={{marginTop: 7, marginBottom: 7}}>Connected</center>
                    }
                  </Card.Footer>
                </Card>
              )
            })
          }
          </CardDeck>

          <Modal show={showSimpleModal} onHide={ () => setShowSimpleModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Connecting to {providerToConnect}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Enter information to connect to {providerToConnect}:</p>
              {
                providerToConnect && connections.find(c => c.provider === providerToConnect).definition.connection.connectionInfo.map(p =>
                  <Form key={p.name}>
                    <div>
                      <Form.Group as={Row} style={{ margin: 20 }}>
                        <Form.Label style={{ fontWeight: 400, marginRight: 10 }} column sm="3">{p.name}: </Form.Label>
                        <Col sm="8">
                          <Form.Control placeholder={p.description} onChange={ (e) => { p.value = e.target.value }} />
                        </Col>
                      </Form.Group>
                    </div>
                  </Form> )
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowSimpleModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => processConnection('add', providerToConnect) }>
                Connect
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showLinkModal} onHide={ () => setShowLinkModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Linking a new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              To connect to {providerToConnect}, you will need to login  
              to {providerToConnect} and allow SnapMaster access to your data.  
              </p>
              <p>
              Note that once your approve these permissions, you will be 
              asked to log in again with your primary login.
              </p>
              <p>
              At the end of the process, you will see {providerToConnect} connected as one of your   
              tools!
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowLinkModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => link(providerToConnect) }>
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

export default LibraryPage