import React from 'react'
import { Card } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const ProviderCard = ({provider}) => {

  const providerTitle = provider.provider.split('-')[0];
  return (
    <HighlightCard 
      key={providerTitle} 
      style={{ maxWidth: '150px', textAlign: 'center' }}>
      <Card.Body>
        <Card.Img variant="top" src={provider.image} style={{ width: '6rem' }}/>
      </Card.Body>
      <Card.Footer>
        {providerTitle}
      </Card.Footer>
    </HighlightCard>
  )
}

export default ProviderCard