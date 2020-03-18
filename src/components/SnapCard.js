import React from 'react'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { Card, Button } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const SnapCard = ({snap, currentUser, deleteAction}) => {
  const { connections } = useConnections();
  const triggerConn = connections.find(c => c.provider === snap.provider);
  const triggerIcon = triggerConn.image;
  const [account, name] = snap.snapId.split('/');
  const displayName = name.length > 22 ? name.slice(0, 21) + '...' : name;

  const CardImage = ({image}) => 
    <Card.Img src={image} style={{ 
      verticalAlign: 'top', 
      width: '3rem', 
      height: '3rem', 
      border: '1px solid #aaa', 
      borderRadius: 4 
    }} />

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
        { deleteAction && 
          <Button type="button" className="close" onClick={deleteAction}>
            <span className="float-right"><i className="fa fa-remove"></i></span>
          </Button>
        }
        { account !== currentUser && <Card.Subtitle as="div">{account} /</Card.Subtitle> }
        <Card.Subtitle as="div">{displayName}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <CardImage image={triggerIcon} />
        <i style={{ fontSize: '3em', marginLeft: 20 }} className="fa fa-play text-muted" /> 
        <br />
        <br />
        <center>
        { snap.actions && snap.actions.map((action, key) => {
            const config = snap.config && snap.config.find(c => c.name === action);
            const provider = config && config.provider;
            const actionConn = connections.find(c => c.provider === provider);
            const actionIcon = actionConn.image;
            return (
              <span style={ key > 0 ? { marginLeft: 10 } : {}}>
                <CardImage key={key} image={actionIcon} />
              </span>
            )
          })
        }
        </center>
      </Card.Body>
    </HighlightCard>
  )
}

export default SnapCard