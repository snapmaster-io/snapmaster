import React from 'react'
import { useConnections } from '../../utils/connections'
import { Card } from 'react-bootstrap'

const ProviderDisplayCard = ({config, opname}) => {
  const { connections } = useConnections();
  const provider = config && connections.find(c => c.provider === config.provider);

  return (
    <div style={{ margin: 10 }}>
      <Card
        style={{ maxWidth: '150px', minWidth: '150px', textAlign: 'center' }}>
        <Card.Body>
          { provider && provider.image ?
            <Card.Img variant="top" src={provider.image} style={{ width: '6rem' }}/> :
            <i className="fa fa-plus" style={{ fontSize: '6em' }} />
          }
        </Card.Body>
        <Card.Footer style={{ minHeight: 56 }}>
          { 
            provider ? config[opname] : "Select tool"
          }
        </Card.Footer>
      </Card>
    </div>
  )
}

export default ProviderDisplayCard