import React from 'react'
import { useConnections } from '../utils/connections'
import { navigate } from 'hookrouter'
import { CardDeck, Card } from 'react-bootstrap'
import Loading from '../components/Loading'
import PageTitle from '../components/PageTitle'
import RefreshButton from '../components/RefreshButton'
import HighlightCard from '../components/HighlightCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'
import DisconnectButton from '../components/DisconnectButton'

const ConnectionsPage = () => {
  const { loading, loadConnections, connections } = useConnections();
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

  // if no tools connected, return a banner to connect tools
  const connectedToolsCount = connections && connections.filter(c => c.connected).length;
  if (connectedToolsCount === 0) {
    return (
      <RedirectBanner
        loadData={loadConnections}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No tools connected yet..."
        redirectUrl="/tools/library"
        anchorText="Library"
        redirectText="to find and connect tools!" />
    )
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
            const connectionTitle = connection.title;
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
                  connected !== 'base' && 
                    <DisconnectButton connection={connection} redirectUrl={'/tools/connections'} />
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