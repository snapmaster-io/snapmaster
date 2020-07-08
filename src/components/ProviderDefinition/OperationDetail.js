import React from 'react'
import { Tab, Row, Col, Nav } from 'react-bootstrap'
import ParamsDetails from './ParamsDetails';

const OperationDetail = ({operation}) => {
  // check for empty parameters
  if (!operation || !operation.parameters || !operation.parameters.length) {
    return <div style={{ marginLeft: 10, marginTop: 8, fontWeight: 400 }}>None</div>
  }

  // get the name of the first parameter
  const firstParam = operation.parameters[0].name;

  return (
    <Tab.Container defaultActiveKey={firstParam}>
      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            { operation && operation.parameters && operation.parameters.map(param =>
              <Nav.Item key={param.name}>
                <Nav.Link eventKey={param.name}><span>{param.name}</span></Nav.Link>
              </Nav.Item>)
            }
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content style={{ top: 0 }}>
            { operation && operation.parameters && operation.parameters.map(param =>
              <Tab.Pane key={param.name} eventKey={param.name}>
                <ParamsDetails param={param} />
              </Tab.Pane>)
            }
          </Tab.Content>
        </Col>
      </Row>      
    </Tab.Container>
  )
}

export default OperationDetail