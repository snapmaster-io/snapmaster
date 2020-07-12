import React from 'react'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { calculateStringLength } from '../utils/strings'
import { Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const ActionCard = ({action, currentUser, deleteAction}) => {
  const { connections } = useConnections();
  const actionConnection = connections.find(c => c.provider === action.provider);
  const actionIcon = actionConnection && actionConnection.image;
  const actionBorder = actionConnection && actionConnection.connected ? '#28a745' : '#dc3545';
  const [account, name] = action.actionId.split('/');
  const stringLen = calculateStringLength(name, 220);
  const displayName = stringLen < name.length ? name.slice(0, stringLen) + '...' : name;

  const DisplayAccount = ({accountName}) =>
    <span>
      {accountName}
    </span>

  const CardImage = ({image, borderColor}) => 
    <Card.Img src={image} style={{ 
      verticalAlign: 'top', 
      width: '3rem', 
      height: '3rem', 
      border: `1px solid ${borderColor}`, 
      borderRadius: 4,
      padding: '1px'
    }} />

  const renderTooltip = (props) => 
    <Tooltip id="tooltip" {...props} show={props.show.toString()}>
      <div>
        {action.description}
      </div>
    </Tooltip>
    
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 50, hide: 0 }}
      overlay={renderTooltip}
    >
      <HighlightCard 
        key={action.actionId} 
        onClick={ () => navigate(`/snaps/actions/${action.actionId}`)}
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
          { account !== currentUser && <Card.Subtitle as="div"><DisplayAccount accountName={account}/> /</Card.Subtitle> }
          <Card.Subtitle as="div">{displayName}</Card.Subtitle>
        </Card.Header>
        <Card.Body style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex' }}>
            <CardImage image={actionIcon} borderColor={actionBorder} />
            <div style={{ marginLeft: 20, marginTop: -5, fontSize: '1.25em' }}>
              { action.actions && action.actions.slice(0, 5).map(a => {
                  const name = a.name;
                  const stringLen = calculateStringLength(name, 120);
                  const displayName = stringLen < name.length ? name.slice(0, stringLen) + '...' : name;
                  return <div key={name}>{displayName}</div>;
                })
              }
            </div>
          </div>
        </Card.Body>
      </HighlightCard>
    </OverlayTrigger>
  )
}

export default ActionCard