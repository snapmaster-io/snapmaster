import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

const GooglePage = () => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='GCP Projects'
      connectionName='gcp'
      endpoint='gcp'
      setData={ setData }>
      <GoogleCards data={data}/>
    </BaseProvider>
  )
}

const GoogleCards = ({data}) => 
  <CardDeck>
  {
    data && data.map && data.map((item, key) => {
      const { name } = item
      return (
        <Card 
          key={key} 
          style={{ maxWidth: '150px', textAlign: 'center' }}>
          <Card.Body>
            <Card.Title className="text-center">{name}</Card.Title>
          </Card.Body>
        </Card>
      )
    }) 
  }
  </CardDeck>
  
export default GooglePage