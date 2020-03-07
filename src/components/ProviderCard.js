import React from 'react'
import { Card } from 'react-bootstrap'
import HighlightCard from './HighlightCard'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'

const ProviderCard = ({provider}) => {
  const providerTitle = provider.provider.split('-')[0];
  return (
    <div style={{ margin: 10 }}>
      <HighlightCard 
        key={providerTitle} 
        border={ provider.connected ? 'success' : 'danger' }
        style={{ maxWidth: '150px', textAlign: 'center' }}>
        <Card.Body>
          <Card.Img variant="top" src={provider.image} style={{ width: '6rem' }}/>
        </Card.Body>
        <Card.Footer style={{ minHeight: 56 }}>
          { 
            provider.connected 
              ? 'Connected' 
              : <Button size='sm' onClick={ () => { navigate('/tools/library')}}>Connect</Button>
          }
        </Card.Footer>
      </HighlightCard>
    </div>
  )
}

export default ProviderCard