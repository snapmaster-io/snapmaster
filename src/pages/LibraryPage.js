import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { connectedOAuth2Provider } from '../utils/auth'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { Card, CardDeck, Modal, Button } from 'react-bootstrap'
import HighlightCard from '../components/HighlightCard'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ConnectButton from '../components/ConnectButton'

const LibraryPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const { user, loginWithRedirect } = useAuth0();
  const { post } = useApi();
  const [showErrorModal, setShowErrorModal] = useState(false);
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

              const onClickHandler = () => {
                const url = tool.connected ? `/tools/${tool.title}` : `/tools/${tool.title}/definition`;
                navigate(url);
              }

              return (
                <HighlightCard 
                  key={key} 
                  style={{ 
                    maxWidth: '150px', 
                    minWidth: '150px', 
                    marginBottom: '30px',
                    textAlign: 'center' 
                  }}>
                  <Card.Body
                    onClick={onClickHandler}>
                    <Card.Img variant="top" src={tool.image} style={{ width: '6rem' }}/>
                  </Card.Body>
                  <Card.Footer>
                    {
                      !tool.connected && tool.type !== 'disabled' && <ConnectButton tool={tool} />
                    }
                    { 
                      !tool.connected && tool.type === 'disabled' &&
                        <center style={{marginTop: 7, marginBottom: 7}}>Coming soon!</center>
                    }
                    { 
                      tool.connected && <center className='text-success' style={{marginTop: 7, marginBottom: 7}}>Connected</center>
                    }
                  </Card.Footer>
                </HighlightCard>
              )
            })
          }
          </CardDeck>

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