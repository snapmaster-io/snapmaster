import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
/*
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
*/

const GooglePage = () => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Google business reviews'
      connectionName='google-oauth2'
      endpoint='google'
      setData={ setData }>
{ /*  <CalendarCards data={data}/> */ }
      <h5><i>...coming soon!</i></h5>
    </BaseProvider>
  )
}

/* do not display calendar anymore 
const CalendarCards = ({data}) => 
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
  */
  
export default GooglePage