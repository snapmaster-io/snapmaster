import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { csrfToken, connectedOAuth2Provider } from '../utils/auth'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { Card, CardDeck, Button, Modal } from 'react-bootstrap'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle';
import ServiceDownBanner from '../components/ServiceDownBanner'
import SimpleProviderInfo from '../components/SimpleProviderInfo'

const LibraryPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const { user, loginWithRedirect } = useAuth0();
  const { post } = useApi();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [providerToConnect, setProviderToConnect] = useState();
  const pageTitle = 'Tool Library';

  // if in the middle of a loading loop, put up loading banner and bail
  if (!connections && loading) {
    return <Loading />
  }

  if (!loading && (!connections || !connections.length)) {
    return (
      <ServiceDownBanner
        loadData={loadConnections}
        loading={loading}
        pageTitle={pageTitle}/>
    )
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

  // check if an OAuth2 provider was connected
  const providerName = connectedOAuth2Provider();
  if (providerName) {
    if (providerName === "error") {
      // show error dialog
      setShowErrorModal(true);
    } else {
      // reload connections and navigate to the newly added provider
      loadConnections();
      navigate(`/tools/${providerName}`);
    }
  }

  // add a simple connection
  const processConnection = async (providerName) => {
    const provider = connections.find(c => c.provider === providerName);
    const connectionInfo = provider.definition.connection.connectionInfo;
    const entity = provider.definition.connection.entity;

    const body = JSON.stringify({ 
      action: 'add', 
      provider: providerName, 
      connectionInfo: connectionInfo,
      entityName: entity
    });

    const [response, error] = await post('connections', body);
    if (error || !response.ok) {
      return;
    }

    const responseData = await response.json();
    const success = responseData && responseData.message !== 'error';
    if (success) {
      loadConnections();
      navigate(`/tools/${providerName}`);
    }
  }

  // add an OAuth connection
  const processOAuth = async (providerName) => {
    const state = csrfToken()
    const { location, localStorage } = window
    /* Set csrf token */
    localStorage.setItem(state, 'true')

    // initiate a redirect to the OAuth start endpoint
    const redirectTo = `${location.origin}${location.pathname}`;

    // construct API service URL
    const baseUrl = window.location.origin;
    const urlObject = new URL(baseUrl);

    // replace port for local development from 3000 to 8080
    if (urlObject.port && urlObject.port > 80) {
      urlObject.port = 8080;
    }

    // create oauth URL and set the browser address
    window.location = `${urlObject}oauth/start/${providerName}?url=${redirectTo}&csrf=${state}&providerName=${providerName}&userId=${user.sub}`;
  }  

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        connections && connections.map && 
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

              // set up the connect action
              const oauthAction = () => { 
                setProviderToConnect(tool.provider); 
                setShowOAuthModal(true);
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
                      !tool.connected && tool.type === 'oauth' &&
                        <Button variant='primary' onClick={oauthAction}>Connect</Button>
                    }
                    { 
                      !tool.connected && tool.type === 'disabled' &&
                        <center style={{marginTop: 7, marginBottom: 7}}>Coming soon!</center>
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

          <Modal show={showSimpleModal} dialogClassName="modal-50w" onHide={ () => setShowSimpleModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Connecting to {providerToConnect}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SimpleProviderInfo providerName={providerToConnect} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowSimpleModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => processConnection(providerToConnect) }>
                Connect
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showLinkModal} dialogClassName="modal-50w" onHide={ () => setShowLinkModal(false) }>
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

          <Modal show={showOAuthModal} dialogClassName="modal-50w" onHide={ () => setShowOAuthModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Connecting a new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              To connect to {providerToConnect}, you will need to login  
              to {providerToConnect} and allow SnapMaster access to your data.  
              </p>
              <p>
              At the end of the process, you will see {providerToConnect} connected as one of your   
              tools!
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowOAuthModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => processOAuth(providerToConnect) }>
                Connect 
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showErrorModal} onHide={ () => setShowErrorModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Error encountered in OAuth2 connection</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={ () => setShowErrorModal(false) }>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      }
    </div>
  )
}

export default LibraryPage