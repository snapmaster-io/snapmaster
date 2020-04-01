import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { useConnections } from '../utils/connections'
import BaseProvider from './BaseProvider'
import { CardDeck, Card, FormControl, InputGroup, Modal, Button, Alert } from 'react-bootstrap'
import HighlightCard from '../components/HighlightCard'
import SimpleProviderInfo from '../components/SimpleProviderInfo'

const GooglePage = () => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='GCP Projects'
      connectionName='gcp'
      endpoint='gcp'
      setData={setData}>
      <ProjectCards data={data} setData={setData} />
    </BaseProvider>
  )
}

const ProjectCards = ({data, setData}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [project, setProject] = useState();
  const [selected, setSelected] = useState();
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getProject = async (id) => {
    // dismiss the Alert
    setNotFound(false);

    // store the state associated with the selected project
    setSelected(id);

    setProject(projectData.find(p => p.id === id));
  }

  const processProject = async (action, project) => {
    setShowModal(false);
    setNotFound(false);

    const data = { action: action };
    if (action === 'add') {
      setSelected(null);
      setProject(null);

      // add a simple connection
      const provider = connections.find(c => c.provider === 'gcp');
      const connectionInfo = provider.definition.connection.connectionInfo;
      data.connectionInfo = connectionInfo;
    }
    if (action === 'remove') {
      setSelected(null);
      setProject(null);
      data.project = project;
    }

    const [response, error] = await post('gcp', JSON.stringify(data));
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

  const addProject = () => {
    setNotFound(false);
    setSelected(null);
    setProject(null);
    setShowModal(true);
  }

  const projectData = data && data.map(item => {
    return { 
      id: item.project,
      name: item.project,
      project: item.project,
      //date: new Date(item.createTime).toLocaleString(),
      url: `https://console.cloud.google.com/home/dashboard?project=${item.project}`
    } 
  });

  return (
    <div>
      <Alert variant="danger" show={notFound} onClose={() => setNotFound(false)} dismissible>Project not found</Alert>

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
          projectData && projectData.map ? projectData.map((item, key) => {
            const { name, id, url } = item;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 12 ? name.slice(0, 11) + '...' : name;
          
            const loadProject = () => {
              getProject(id);
            }

            const removeProject = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processProject('remove', id);
            }

            return (
              <HighlightCard className="text-center" onClick={loadProject} 
                key={key} border={border}
                style={{ maxWidth: '200px' }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={removeProject}>
                    <span className="float-right"><i className="fa fa-remove"></i></span>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Subtitle>{name}</Card.Subtitle>
                  { /*<Card.Img src={image_url} alt={displayName} style={{ maxHeight: 100, maxWidth: 100 }} />*/}
                </Card.Body>
              </HighlightCard>
            )
          })
          : <div/>
        }
          <HighlightCard className="text-center" onClick={addProject}
            key='add' 
            style={{ maxWidth: '200px' }}>
            <Card.Header>Add a new project</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>

        </CardDeck>
      </div>
      { 
        projectData ? 
        <div style={{
          position: "fixed", 
          top: 350
        }}>
          <div style={{
            position: "sticky",
            top: 0
          }}>
            <h4>Project info</h4>
          </div>
          <h4>{project && project.name}</h4>
        </div> :
        <div/>
      }

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Add a project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SimpleProviderInfo providerName='gcp' />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => setShowModal(false) }>
            Cancel
          </Button>
          <Button variant="primary" onClick={ () => processProject('add') }>
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
  
export default GooglePage