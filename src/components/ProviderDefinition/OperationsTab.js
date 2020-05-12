import React from 'react'
import { Tab, Row, Col, Nav, Jumbotron } from 'react-bootstrap'
import OperationDetail from './OperationDetail'
import './OperationsTab.css'

const OperationsTab = ({operations}) => {
  // bail if no operations
  if (!operations || !operations.length) {
    return <Jumbotron><h2 className="text-center">None</h2></Jumbotron>
  }

  // get the first key
  const firstKey = operations[0].name;
  return (
    <Tab.Container defaultActiveKey={firstKey}>
      <Row>
        <Col sm={2}>
          <h5 style={{ marginLeft: 10, fontSize: 18 }}>Name</h5>
        </Col>
        <Col sm={10}>
          <h5 style={{ marginLeft: 10, fontSize: 18 }}>Parameters</h5>          
        </Col>
      </Row>
      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            { operations && operations.map(op =>
              <Nav.Item key={op.name}>
                <Nav.Link className="light-pills" eventKey={op.name}><span>{op.name}</span></Nav.Link>
              </Nav.Item>)
            }
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content style={{ top: 0 }}>
            { operations && operations.map(op =>
              <Tab.Pane eventKey={op.name} key={op.name}>
                <OperationDetail operation={op} />
              </Tab.Pane>)
            }
          </Tab.Content>
        </Col>
      </Row>      
    </Tab.Container>
  )
}

export default OperationsTab