import React, { useState } from 'react'
import { useApi } from '../utils/api'
import BaseProvider from './BaseProvider'
import { CardDeck, Card, FormControl, InputGroup, Modal, Button, Alert } from 'react-bootstrap'
import HighlightCard from '../components/HighlightCard'
import FilterTable from '../components/FilterTable'
import DataTable from '../components/DataTable'

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

const RepositoryCards = ({data, setData}) => {
  const { get, post } = useApi();
  const [reviewsData, setReviewsData] = useState();
  const [reviews, setReviews] = useState();
  const [selected, setSelected] = useState();
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [repositories, setRepositories] = useState();
  const [allRepos, setAllRepos] = useState();

  const getRepositories = async () => {
    // dismiss the Alert
    setNotFound(false);

    const [response, error] = await get('github');
    if (error || !response.ok) {
      setRepositories(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      setRepositories(items);
    }
  }

  const getAllRepos = async () => {
    // dismiss the Alert
    setNotFound(false);

    const [response, error] = await get('github/repos');
    if (error || !response.ok) {
      setAllRepos(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      setAllRepos(items);
    }
  }

  const getRepository = async (id) => {
    // dismiss the Alert
    setNotFound(false);

    // store the state associated with the selected business
    setSelected(id);

    const endpoint = `github//${id}`;
    const [response, error] = await get(endpoint);

    if (error || !response.ok) {
      setReviewsData(null);
      setReviews(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      setReviewsData(items);
      const data = items.map(item => {
        const type = item.rating > 3 ? 'positive' : 
                     item.rating < 3 ? 'negative' : 
                     'neutral';
        return { 
          id: item.id,
          date: new Date(item.time_created).toLocaleString(),
          type: type,
          text: item.text,
          user: item.user.name,
          url: item.url
        } 
      });
      setReviews(data);
    }
  }

  const processRepository = async (action, param) => {
    setShowModal(false);
    const data = { action: action };
    if (action === 'add') {
      data.phone = param;
    }
    if (action === 'remove') {
      setSelected(null);
      setReviews(null);
      setReviewsData(null);
      data.businessId = param;
    }

    const [response, error] = await post('github', JSON.stringify(data));
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

  const urlFormatter = (cell, row) => {
    return <a href={row.url} target="_">{cell}</a>
  }

  const typeFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ formatExtraData[cell] } />
    )
  }

  const columns = [{
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '220px' };
    }
  }, {
    dataField: 'text',
    text: 'Text',
    formatter: urlFormatter
  }];

  const addRepositories = async () => {
    setNotFound(false);
    await getAllRepos();
    setShowModal(true);
  }

  return (
    <div>
      <Alert variant="danger" show={notFound} onClose={() => setNotFound(false)} dismissible>Business not found</Alert>

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
          data && data.map ? data.map((item, key) => {
            const { __id: id, url, image_url } = item;
            const border = (id === selected) ? 'primary' : null;
            const name = id;
            const displayName = name.length > 19 ? name.slice(0, 18) + '...' : name;
          
            const loadReviews = () => {
              getRepository(id);
            }

            const removeRepository = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processRepository('remove', id);
            }

            return (
              <HighlightCard className="text-center" onClick={loadReviews} 
                key={key} border={ border ? border : null }
                style={{ maxWidth: '200px' }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={removeRepository}>
                    <span className="float-right"><i className="fa fa-remove"></i></span>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{id}</Card.Title>
                  { /* <Card.Img src={image_url} alt={displayName} style={{ maxHeight: 100, maxWidth: 100 }} /> */ }
                </Card.Body>
              </HighlightCard>
            )
          })
          : <div/>
        }
          <HighlightCard className="text-center" onClick={addRepositories}
            key='add' 
            style={{ maxWidth: '200px' }}>
            <Card.Header>Add repositories</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>

        </CardDeck>
      </div>
      { 
        reviewsData ? 
        <div style={{
          position: "fixed", 
          top: 350
        }}>
          <div style={{
            position: "sticky",
            top: 0
          }}>
            <h4>Reviews</h4>
          </div>
          <FilterTable
            data={reviewsData}
            setData={setReviewsData}
            dataRows={reviews}
            columns={columns}
            keyField="id"
            path={`github/repos/${selected}`}
            maxHeight="calc(100vh - 460px)"
            />
        </div> :
        <div/>
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
            allRepos && 
            <FilterTable
              data={allRepos}
              setData={setAllRepos}
              dataRows={allRepos}
              columns={[{
                dataField: 'name',
                text: 'Name',
                sort: true,
              }]}
              keyField="name"
              path={`github/repos`}
              maxHeight="calc(80vh - 120px)">
              <Button variant="secondary" onClick={ () => setShowModal(false) }>
                Done
              </Button>              
            </FilterTable>
          }
          {
            false && 
            <DataTable
              data={allRepos}
              setData={setAllRepos}
              dataRows={allRepos}
              columns={[{
                dataField: 'name',
                text: 'Name',
                sort: true,
              }]}
              keyField="name"
              path={`github/repos/${selected}`}
              maxHeight="calc(80vh - 120px)"
            /> 
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
