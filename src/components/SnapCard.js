import React from 'react'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { Card } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const SnapCard = ({snap, currentUser}) => {
  const { connections } = useConnections();
  const triggerConn = connections.find(c => c.provider === snap.provider);
  console.log(snap.provider);
  const triggerIcon = triggerConn.image;
  const displayName = snap.name.length > 22 ? snap.name.slice(0, 21) + '...' : snap.name;

  return (
    <HighlightCard 
      key={snap.snapId} 
      onClick={ () => navigate(`/snaps/${snap.snapId}`)}
      style={{ 
        minWidth: '230px', 
        maxWidth: '230px', 
        minHeight: '230px',
        maxHeight: '230px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
      <Card.Header>
        { snap.userId !== currentUser && <Card.Subtitle as="h5">{snap.userId} /</Card.Subtitle> }
        <Card.Subtitle as="h5">{displayName}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Img src={triggerIcon} style={{ marginRight: 10, verticalAlign: 'top', width: '3rem', height: '3rem' }}/>
        <i style={{ fontSize: '3em', marginLeft: 10 }} className="fa fa-play text-muted" /> 
        <br />
        <br />
        <center>
        { snap.actions && snap.actions.map((action, key) => {
            const config = snap.config && snap.config.find(c => c.name === action);
            const provider = config && config.provider;
            const actionConn = connections.find(c => c.provider === provider);
            const actionIcon = actionConn.image;
            return <Card.Img key={key} src={actionIcon} style={{ width: '3rem', height: '3rem', margin: 10 }}/>
          })
        }
        </center>
      </Card.Body>
    </HighlightCard>
  )
}

export default SnapCard