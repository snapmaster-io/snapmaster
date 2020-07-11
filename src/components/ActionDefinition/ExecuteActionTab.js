import React, { useState } from 'react'
import { useApi } from '../../utils/api'
import { useConnections } from '../../utils/connections'
import { Button, Card, Modal, Jumbotron, Tab, Row, Col, Nav } from 'react-bootstrap'
import ActionParametersEditor from './ActionParametersEditor'
import Highlight from '../Highlight'

const ExecuteActionTab = ({action}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();
  const [result, setResult] = useState();

  const actionId = action && action.actionId;
  const operations = action && action.actions;

  const execute = async (op) => {
    // set the spinner
    setRefresh(true);
    setError(null);
    setResult(null);

    // post a request to the actions endpoint
    const request = {
      action: 'execute',
      actionId: actionId,
      operation: op.name,
      params: op.parameters
    };

    const [response, error] = await post('actions', JSON.stringify(request));

    // turn off the spinner
    setRefresh(false);

    if (error || !response.ok) {
      setError(error.message || 'Unknown error');
      setShowModal(true);
      return;
    }

    const item = await response.json();  
    if (!item || item.error) {
      setError(item.message);
      setShowModal(true);
      return;
    }
  
    setError(null);
    setResult(item.data);
    setShowModal(true);
  }

  // bail if no operations
  if (!operations || !operations.length) {
    return <Jumbotron><h2 className="text-center">None</h2></Jumbotron>
  }

  // get the first key
  const firstKey = operations[0].name;

  // get the action provider
  const actionProvider = action && connections && connections.find(el => el.provider === action.provider);

  // if one of the providers ins't connected, the activate tab should be disabled
  const disableExecuteFlag = !actionProvider;

  return (
    disableExecuteFlag ? 
      <h5>Before executing an action, please connect the tool it references</h5> :
      <div>
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
                <Card>
                  <Card.Body>
                    <ActionParametersEditor params={op && op.parameters} />
                    <Button variant="primary" style={{ marginTop: 10 }} onClick={ () => execute(op) }>
                      <i className={`fa fa-${refresh ? 'spinner' : 'play'}`} />&nbsp;&nbsp;Execute
                    </Button>
                  </Card.Body>
                </Card>
                </Tab.Pane>)
              }
              </Tab.Content>
            </Col>
          </Row>      
        </Tab.Container>


        <Modal show={showModal} dialogClassName={error ? "modal-50w" : "modal-90w"} onHide={ () => setShowModal(false) }>
          <Modal.Header closeButton>
            <Modal.Title>{error ? 'Error' : 'Result'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          { error || '' }
          { result && <Highlight style={{ maxHeight: 'calc(70vh)'}}>{JSON.stringify(result, null, 2)}</Highlight> }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={ () => setShowModal(false) }>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default ExecuteActionTab
