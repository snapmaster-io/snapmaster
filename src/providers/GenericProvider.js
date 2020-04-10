import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { useConnections } from '../utils/connections'
import { calculateStringLength } from '../utils/strings'
import { CardDeck, Card, Modal, Button, Alert } from 'react-bootstrap'
import BaseProvider from './BaseProvider'
import HighlightCard from '../components/HighlightCard'
import SimpleProviderInfo from '../components/SimpleProviderInfo'
import TriggerActionConfig from '../components/TriggerActionConfig'

const GenericProviderPage = ({
  pageTitle,
  connectionName,
  endpoint,
  entityName,
}) => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle={pageTitle}
      connectionName={connectionName}
      endpoint={endpoint}
      entityName={entityName}
      setData={setData}>
      <GenericProviderCards 
        data={data} 
        setData={setData} 
        connectionName={connectionName} 
        entityName={entityName}
        endpoint={endpoint} />
    </BaseProvider>
  )
}

const GenericProviderCards = ({data, setData, connectionName, entityName, endpoint}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [entity, setEntity] = useState();
  const [selected, setSelected] = useState();
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const provider = connections.find(c => c.provider === connectionName);

  const getEntity = async (id) => {
    // dismiss the Alert
    setNotFound(false);

    // store the state associated with the selected project
    setSelected(id);

    setEntity(entityData.find(p => p.id === id));
  }

  const processEntity = async (action, id) => {
    setShowModal(false);
    setNotFound(false);

    const data = { action: action };
    if (action === 'add') {
      setSelected(null);
      setEntity(null);

      // add a simple connection
      const connectionInfo = provider.definition.connection.connectionInfo;
      data.connectionInfo = connectionInfo;
    }
    if (action === 'remove') {
      setSelected(null);
      setEntity(null);
      data.id = id;
    }

    const [response, error] = await post(endpoint, JSON.stringify(data));
    if (error || !response.ok) {
      setNotFound(true);
      return;
    }

    // refresh the data
    const items = await response.json();
    if (items && items.map) {
      setData(items);
    } else {
      // no data returned indicates operation failed
      setNotFound(true);
    }
  }

  const addEntity = () => {
    setNotFound(false);
    setSelected(null);
    setEntity(null);
    setShowModal(true);
  }

  const capitalize = (word) => word && (word.length > 3 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toUpperCase());

  const entityData = data && data.map(item => {
    return { 
      id: item.__id,
      name: item.__name,
      url: item.__url,
      imageUrl: item.__imageUrl,
      triggers: item.__triggers,
      actions: item.__actions,
    } 
  });

  return (
    <div>
      <Alert variant="danger" show={notFound} onClose={() => setNotFound(false)} dismissible>{capitalize(entityName)} not found</Alert>

      <div style={{ 
        position: "fixed",
        background: "white",
        width: "100%",
        marginTop: "-1px",
        height: "151px",
        zIndex: 5
      }}>
        <CardDeck>
        {
          entityData && entityData.map && entityData.map((item, key) => {
            const { name, id, url, imageUrl } = item;
            const border = (id === selected) ? 'primary' : null;
            const stringLen = calculateStringLength(name, 170);
            const displayName = stringLen < name.length ? name.slice(0, stringLen) + '...' : name;
          
            const loadEntity = () => {
              getEntity(id);
            }

            const removeEntity = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processEntity('remove', id);
            }

            return (
              <HighlightCard className="text-center" onClick={loadEntity} 
                key={key} border={border}
                style={{ minWidth: 200, maxWidth: 200, minHeight: 200, maxHeight: 200, marginBottom: 30 }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={removeEntity}>
                    <span className="float-right"><i className="fa fa-remove"></i></span>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Img src={imageUrl || provider.image} alt={displayName} style={{ maxHeight: 100, maxWidth: 100 }} />
                </Card.Body>
              </HighlightCard>
            )
          })
        }
        { entityData && entityData.map && 
          <HighlightCard className="text-center" onClick={addEntity}
            key='add' 
            style={{ minWidth: 200, maxWidth: 200, minHeight: 200, maxHeight: 200, marginBottom: 30 }}>
            <Card.Header>Add a new {entityName}</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>
        }
        </CardDeck>
      </div>

      { 
        selected && 
        <div style={{
          position: "fixed", 
          top: 370
        }}>
          <TriggerActionConfig 
            entity={entity}
            setData={setData}
            path={endpoint}
            />
        </div> 
      }

      <Modal show={showModal} dialogClassName="modal-50w" onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Add a {entityName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SimpleProviderInfo providerName={connectionName} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => setShowModal(false) }>
            Cancel
          </Button>
          <Button variant="primary" onClick={ () => processEntity('add') }>
            Add
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
  )
}

export default GenericProviderPage