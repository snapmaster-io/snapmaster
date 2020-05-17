import React, { useState } from 'react'
import { useConnections } from '../../utils/connections'
import { Button, Card, Modal } from 'react-bootstrap'
import HighlightCard from '../HighlightCard'
import ProviderEditor from './ProviderEditor'

const EditableProviderCard = ({config, setConfig, role, opname}) => {
  const { connections } = useConnections();
  const [showModal, setShowModal] = useState(false);
  const [configState, setConfigState] = useState(config);
  const [OKState, setOKState] = useState(true);
  const provider = config && connections.find(c => c.provider === config.provider);
  const rolename = role.slice(0, role.length - 1);

  const cancel = () => {
    // reset provider state to what was passed in
    setConfigState(config);
    setShowModal(false);
  }

  const ok = () => {
    // store the current value of the provider state in the caller's context
    const newConfig = { name: configState.name, provider: configState.provider };
    newConfig[opname] = configState[opname];
    const newProvider = connections.find(c => c.provider === newConfig.provider);

    // copy over only the parameters that belong to this provider/operation
    const operations = newProvider && newProvider.definition && newProvider.definition[role];
    const op = operations.find(o => o.name === newConfig[opname]);
    const params = op && op.parameters;
    if (params) {
      for (const p of params) {
        newConfig[p.name] = configState[p.name];
      }
    }
    setConfig(newConfig);
    setShowModal(false);
  }

  const deleteAction = () => {
    // set a special property indicating this action should be deleted
    configState.delete = true;
    setConfig(configState);
  }

  const deleteButton = role !== "triggers" && config;

  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <HighlightCard 
        onClick={ () => { setShowModal(true) }}
        key={configState && configState.name} 
        style={{ maxWidth: '150px', minWidth: '150px', textAlign: 'center' }}>
        <Card.Body>
          <div>
            { deleteButton && 
              <Button type="button" className="close" onClick={deleteAction}
                style={{ marginTop: -14 }}>
                <span className="float-right"><i className="fa fa-remove"></i></span>
              </Button>
            }
            { provider && provider.image ?
              <Card.Img variant="top" src={provider.image} style={{ width: '6rem', marginTop: deleteButton ? -10 : 0 }}/> :
              <i className="fa fa-plus" style={{ fontSize: '6em' }} />
            }
          </div>
        </Card.Body>
        <Card.Footer style={{ minHeight: 56 }}>
          { 
            provider && configState ? configState[opname] : "add an action"
          }
        </Card.Footer>
      </HighlightCard>

      <Modal show={showModal} dialogClassName="modal-90w" onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Configure {rolename}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProviderEditor 
            config={configState} 
            setConfig={setConfigState} 
            role={role} 
            opname={opname} 
            setOKState={setOKState} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="primary" disabled={OKState} onClick={ok}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>    
    </div>
  )
}

export default EditableProviderCard