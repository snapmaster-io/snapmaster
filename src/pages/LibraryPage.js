import React, { useState, useCallback, useEffect } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import HighlightCard from '../components/HighlightCard'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import PageTitle from '../components/PageTitle';

const LibraryPage = () => {
  const { get, post } = useApi();
  const [errorMessage, setErrorMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [linkProvider, setLinkProvider] = useState();
  const pageTitle = 'Tool Library';

  const [library, setLibrary] = useState();
  const [loading, setLoading] = useState();

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('library');

      if (error || !response.ok) {
        setLoading(false);
        setLibrary(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setLibrary(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        library && library.map ? 
        <div>
          <CardDeck>
          {
            library.map((tool, key) => {
              // set up the link action
              const action = () => { 
                setLinkProvider(tool.provider); 
                setShowModal(true);
              };

              return (
                <Card 
                  key={key} 
                  style={{ maxWidth: '150px', textAlign: 'center' }}>
                  <Card.Body> 
                    <Card.Img variant="top" src={tool.image} style={{ width: '6rem' }}/>
                  </Card.Body>
                  <Card.Footer>
                    { 
                      !tool.connected && <Button variant='primary' onClick={action}>Connect</Button>
                    }
                    { 
                      tool.connected && <center className='text-success' style={{marginTop: 7, marginBottom: 7}}>Connected</center>
                    }
                  </Card.Footer>
                </Card>
              )
            })
          }
          </CardDeck>

          <Modal show={showModal} onHide={ () => setShowModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Linking a new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              To connect to {linkProvider} as a new snaps source, you will need to login  
              to {linkProvider} and allow SnapMaster access to your data.  
              </p>
              <p>
              Note that once your approve these permissions, you will be 
              asked to log in again with your primary login.
              </p>
              <p>
              At the end of the process, you will see data from {linkProvider} as one of your   
              tools!
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => setShowModal(false) }>
                Link
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        : errorMessage ? 
        <div>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;{errorMessage}</span>
        </div>
        :
        <div />
      }
    </div>
  )
}

export default LibraryPage