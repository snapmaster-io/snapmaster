import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

const InstagramPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Instagram posts'
      connectionName='instagram'
      endpoint='instagram'
      setData={ setData }>
      <InstagramCards data={data}/>
    </BaseProvider>
  )
}

const InstagramCards = ({data}) => 
  <CardDeck>
  {
    data && data.map ? data.map((item, key) => {
      const { summary, backgroundColor } = item
      return (
        <Card 
          key={key} 
          style={{ maxWidth: '150px', textAlign: 'center', color: backgroundColor }}>
          <Card.Body>
            <Card.Title className="text-center">{ summary }</Card.Title>
          </Card.Body>
        </Card>
      )
    }) 
    : <div/>
  }
  </CardDeck>

export default InstagramPage