import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { CardDeck, Card, Button } from 'react-bootstrap'
import Loading from '../components/Loading'
import PageTitle from '../components/PageTitle'
import RefreshButton from '../components/RefreshButton'
import HighlightCard from '../components/HighlightCard'
import ServiceDownBanner from '../components/ServiceDownBanner'

const ConnectionsPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const { user, loginWithRedirect } = useAuth0();
  const { post } = useApi();
  const pageTitle = 'Connections';

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

  // add or remove a simple connection
  const processConnection = async (action, providerName) => {
    const provider = connections.find(c => c.provider === providerName);
    const entity = provider.definition.connection.entity;

    const body = JSON.stringify({ 
      action: action, 
      provider: providerName, 
      entityName: entity
    });

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

  // get set of connected tools
  const connectedTools = connections && connections.filter(c => c.connected);

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <PageTitle usePathAsBreadcrumb title={pageTitle} />
      </div>
      { connections && connections.map &&
        <CardDeck>
        {
          connectedTools.map((connection, key) => {
            // set up some variables
            const connected = connection.connected;
            const uid = `${connection.provider}|${connection.userId}`;
            const connectionTitle = connection.provider.split('-')[0];
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
                  onClick= { () => connectionTitle && navigate(`/tools/${connectionTitle}` )}>
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
                { 
                  connected !== 'base' && connection.type === 'hybrid' &&
                    <Button variant='danger' onClick={ () => { processConnection('remove', connection.provider) } }>Disconnect</Button>
                }
                </Card.Footer>
              </HighlightCard>
            )
          })
        }
        </CardDeck>
      }
    </div>
  )
}

export default ConnectionsPage