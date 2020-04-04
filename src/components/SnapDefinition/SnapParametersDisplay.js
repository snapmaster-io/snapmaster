import React from 'react'
import { Card } from 'react-bootstrap'

const SnapParametersDisplay = ({snap}) =>
  <div>
    <h5 style={{ margin: 10 }}>{snap && 'Parameters:'}</h5>
    <div style={{ marginLeft: 20 }}>
      { snap && snap.parameters && 
        <Card>
          <Card.Body>
          { 
            snap.parameters.map(p => 
              <div key={p.name} style={{ display: 'flex'}}>
                <h5 style={{ fontWeight: 400 }}>{p.name}: </h5>
                <h5>&nbsp;&nbsp;{p.description}</h5>
              </div> 
            )
          }
          </Card.Body>
        </Card>
      }
    </div>
  </div>

export default SnapParametersDisplay