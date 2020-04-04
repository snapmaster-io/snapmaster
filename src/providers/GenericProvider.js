import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { useConnections } from '../utils/connections'
import { CardDeck, Card, Modal, Button, Alert } from 'react-bootstrap'
import BaseProvider from './BaseProvider'
import HighlightCard from '../components/HighlightCard'
import SimpleProviderInfo from '../components/SimpleProviderInfo'

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

  const processEntity = async (action, project) => {
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
      data.project = project;
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

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const entityData = data && data.map(item => {
    return { 
      id: item.__id,
      name: item.__name,
      url: item.__url
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
          entityData && entityData.map ? entityData.map((item, key) => {
            const { name, id, url, imageUrl } = item;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 12 ? name.slice(0, 11) + '...' : name;
          
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
          : <div/>
        }
          <HighlightCard className="text-center" onClick={addEntity}
            key='add' 
            style={{ minWidth: 200, maxWidth: 200, minHeight: 200, maxHeight: 200, marginBottom: 30 }}>
            <Card.Header>Add a new {entityName}</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>

        </CardDeck>
      </div>
      { 
        entityData ? 
        <div style={{
          position: "fixed", 
          top: 350
        }}>
          <div style={{
            position: "sticky",
            top: 0
          }}>
            <h4>{capitalize(entityName)} information</h4>
          </div>
          <h4>{entity && entity.name}</h4>
        </div> :
        <div/>
      }

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
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

/*
const ProjectCards = ({data}) => {
  const { post } = useApi();
  const [selected, setSelected] = useState();
  const [repo, setRepo] = useState();
  const [showModal, setShowModal] = useState(false);

  const refreshData = async (method, data) => {
    const [response, error] = await method('github', JSON.stringify(data));
    if (error || !response.ok) {
      return;
    }

    // refresh the data
    const items = await response.json();
    if (items && items.map) {
      setData(items);
    }
  }

  const processProject = async (action, param) => {
    const data = { __id: param };
    if (action === 'remove') {
      setSelected(null);
      data.__active = false;
    }

    await refreshData(post, [data]);
  }

  // get the active projects
  const projects = data;

  return (
    <div>
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
          projects && projects.map && projects.map((item, key) => {
            const { name } = item;
            const id = name;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 12 ? name.slice(0, 11) + '...' : name;
            const url = `https://console.cloud.google.com/home/dashboard?project=${name}`;
          
            const selectRepo = (repo) => {
              // initialize triggers and actions if they don't yet exist with a deep-copy array based on the template
              if (!repo.__triggers) {
                repo.__triggers = JSON.parse(JSON.stringify(githubTriggers));
              }              
              if (!repo.__actions) {
                repo.__actions = JSON.parse(JSON.stringify(githubActions));
              }
              
              setRepo(repo);
              setSelected(repo.name);
            }

            const deactivateProject = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processProject('remove', id);
            }

            return (
              <HighlightCard className="text-center" onClick={() => { selectRepo(item) }}
                key={key} border={ border ? border : null }
                style={{ maxWidth: '180px' }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={deactivateProject}>
                    <span className="float-right"><i className="fa fa-remove"></i></span>
                  </Button>
                </Card.Header>
                <Card.Body>
                { 
                  fork ? <i className='fa fa-code-fork' style={{ fontSize: '4em'}} />
                       : <i className='cloudfont-repo' style={{ fontSize: '4em'}} /> 
                }
                </Card.Body>
              </HighlightCard>
            )
          })
        }
          <HighlightCard className="text-center" onClick={ () => { setShowModal(true) }}
            key='add' 
            style={{ maxWidth: '180px' }}>
            <Card.Header>Add repositories</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '5em' }} />
            </Card.Body>
          </HighlightCard>

        </CardDeck>
      </div>
      { 
        selected && 
        <div style={{
          position: "fixed", 
          top: 350
        }}>
          <TriggerActionConfig 
            entity={ repo }
            setData= { setData }
            path='github'
            />
        </div> 
      }

  <CardDeck>
  {
    data && data.map && data.map((item, key) => {
      const { name } = item
      return (
        <Card 
          key={key} 
          style={{ maxWidth: '150px', textAlign: 'center' }}>
          <Card.Body>
            <Card.Title className="text-center">{name}</Card.Title>
          </Card.Body>
        </Card>
      )
    }) 
  }
  </CardDeck>
  */
  
export default GenericProviderPage