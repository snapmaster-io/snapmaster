import React from 'react'
import { navigate } from 'hookrouter'
import { Card, Button } from 'react-bootstrap'

const ConnectionCard = ({providerInfo}) =>
  <div style={{ margin: 10 }}>
    <Card 
      key={providerInfo.title} 
      border={ providerInfo.connected ? 'success' : 'danger' }
      style={{ maxWidth: '150px', textAlign: 'center' }}>
      <Card.Body>
        <Card.Img variant="top" src={providerInfo.image} style={{ width: '6rem' }}/>
      </Card.Body>
      <Card.Footer style={{ minHeight: 56 }}>
        { 
          providerInfo.connected 
            ? providerInfo.action
            : <Button size='sm' onClick={ () => { navigate('/tools/library')}}>Connect</Button>
        }
      </Card.Footer>
    </Card>
  </div>

export default ConnectionCard