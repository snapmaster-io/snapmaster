import React, { useState } from 'react'
import { useApi } from '../utils/api'
import BaseProvider from './BaseProvider'
import { CardDeck, Card, Modal, Button } from 'react-bootstrap'
import HighlightCard from '../components/HighlightCard'
import FilterTable from '../components/FilterTable'
import TriggerActionConfig from '../components/TriggerActionConfig'

const GithubPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Github setup'
      connectionName='github'
      endpoint='github'
      setData={setData}>
      <RepositoryCards data={data} setData={setData} />
    </BaseProvider>
  )
}

const githubTriggers = [{
  name: 'push',
}, {
  name: 'issued opened',
}, {
  name: 'issue closed',
}, {
  name: 'pull request',
}];
  
const githubActions = [{
  name: 'open issue',
}, {
  name: 'close issue',
}, {
  name: 'merge pull request',
}];

const RepositoryCards = ({data, setData}) => {
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

  const processRepository = async (action, param) => {
    const data = { __id: param };
    if (action === 'remove') {
      setSelected(null);
      data.__active = false;
    }

    await refreshData(post, [data]);
  }

  // get the subset of repo's that have been activated
  const activeRepos = data && data.filter && data.filter(r => r.__active);

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
          activeRepos && activeRepos.map && activeRepos.map((item, key) => {
            const { html_url, fork, name } = item;
            const id = name;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 12 ? name.slice(0, 11) + '...' : name;
          
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

            const deactivateRepo = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processRepository('remove', id);
            }

            return (
              <HighlightCard className="text-center" onClick={() => { selectRepo(item) }}
                key={key} border={ border ? border : null }
                style={{ minWidth: 180, maxWidth: 180, minHeight: 180, maxHeight: 180, marginBottom: 30 }}>
                <Card.Header>
                  <Card.Link href={html_url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={deactivateRepo}>
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
        { activeRepos && activeRepos.map && 
          <HighlightCard className="text-center" onClick={ () => { setShowModal(true) }}
            key='add' 
            style={{ minWidth: 180, maxWidth: 180, minHeight: 180, maxHeight: 180, marginBottom: 30 }}>
            <Card.Header>Add repositories</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '5em' }} />
            </Card.Body>
          </HighlightCard>
        }
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

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Manage repositories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Select repositories to enable:  
          </p>
          {
            data && 
            <FilterTable
              data={data}
              setData={setData}
              dataRows={data}
              columns={[{
                dataField: 'name',
                text: 'Name',
                sort: true,
              }]}
              keyField="name"
              path={`github`}
              maxHeight="calc(80vh - 120px)">
              <Button variant="secondary" onClick={ () => setShowModal(false) }>
                Done
              </Button>              
            </FilterTable>
          }
        </Modal.Body>
        <Modal.Footer>
          &nbsp;
        </Modal.Footer>
      </Modal>      
    </div>
  )
}

export default GithubPage
