import React from 'react'
import { navigate } from 'hookrouter'
import { Card } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const DashboardCard = ({title, url, border, color, label, value}) => 
  <HighlightCard
    onClick={ () => { navigate(url)} }
    //className='mx-auto'
    border={border}
    style={{ 
      maxWidth: '220px', 
      minWidth: '220px', 
      textAlign: 'center', 
      marginBottom: 25 }}>
    <Card.Header as="h5">{title}</Card.Header>
    <Card.Body>
      { label ? 
        <div>
          <Card.Title>{label}</Card.Title>
          <Card.Title as="h1" style={{ color: 'gray' }}>{value}</Card.Title>
        </div>
        :
        <Card.Title as="h1" style={{ color: color, fontSize: '5em' }}>{value}</Card.Title>
      }
    </Card.Body>
  </HighlightCard>

export default DashboardCard