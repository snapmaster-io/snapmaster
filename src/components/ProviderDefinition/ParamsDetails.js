import React from 'react'
import { Card } from 'react-bootstrap'

const ParamsDetails = ({param}) => 
  <Card>
    <Card.Body>
    { 
      param && Object.keys(param).map(key => 
        <div key={key} style={{ display: 'flex'}}>
          <h5 style={{ fontWeight: 400, fontSize: 18 }}>{key}: </h5>
          <h5 style={{ fontSize: 18 }}>&nbsp;&nbsp;{param[key].toString()}</h5>
        </div> 
      )
    }
    </Card.Body>
  </Card>

export default ParamsDetails