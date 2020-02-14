import React, { useState } from 'react'
import { useApi } from '../utils/api'
import BaseProvider from './BaseProvider'
import { CardDeck, Card, FormControl, InputGroup, Modal, Button, Alert } from 'react-bootstrap'
import HighlightCard from '../components/HighlightCard'
import FilterTable from '../components/FilterTable'

const YelpPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Yelp reviews'
      connectionName='yelp'
      endpoint='yelp'
      setData={setData}>
      <BusinessCards data={data} setData={setData} />
    </BaseProvider>
  )
}

const BusinessCards = ({data, setData}) => {
  const { get, post } = useApi();
  const [reviewsData, setReviewsData] = useState();
  const [reviews, setReviews] = useState();
  const [selected, setSelected] = useState();
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getBusiness = async (id) => {
    // dismiss the Alert
    setNotFound(false);

    // store the state associated with the selected business
    setSelected(id);

    const endpoint = `yelp/reviews/${id}`;
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

  const processBusiness = async (action, param) => {
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

    const [response, error] = await post('yelp', JSON.stringify(data));
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
    dataField: 'date',
    text: 'Date',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '220px' };
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    },
    align: 'center',
    formatter: typeFormatter,
    formatExtraData: {
      positive: 'fa fa-thumbs-up fa-2x text-success',
      neutral: 'fa fa-minus fa-2x text-warning',
      negative: 'fa fa-thumbs-down fa-2x text-danger'
    }
  }, {
    dataField: 'user',
    text: 'User',
    headerStyle: (column, colIndex) => {
      return { width: '120px' };
    }
  }, {
    dataField: 'text',
    text: 'Text',
    formatter: urlFormatter
  }];

  const addBusiness = () => {
    setNotFound(false);
    setSelected(null);
    setReviews(null);
    setReviewsData(null);
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
            const { name, id, url, image_url } = item;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 19 ? name.slice(0, 18) + '...' : name;
          
            const loadReviews = () => {
              getBusiness(id);
            }

            const removeBusiness = (e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              processBusiness('remove', id);
            }


            return (
              <HighlightCard className="text-center" onClick={loadReviews} 
                key={key} border={ border ? border : null }
                style={{ maxWidth: '200px' }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                  <Button type="button" className="close" onClick={removeBusiness}>
                    <span className="float-right"><i className="fa fa-remove"></i></span>
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Img src={image_url} alt={displayName} style={{ maxHeight: 100, maxWidth: 100 }} />
                </Card.Body>
              </HighlightCard>
            )
          })
          : <div/>
        }
          <HighlightCard className="text-center" onClick={addBusiness}
            key='add' 
            style={{ maxWidth: '200px' }}>
            <Card.Header>Add a new business</Card.Header>
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
            path={`yelp/reviews/${selected}`}
            maxHeight="calc(100vh - 460px)"
            />
        </div> :
        <div/>
      }

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Add a business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Look up the business by phone number:  
          </p>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Phone number</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="phone"
              aria-describedby="inputGroup-sizing-default"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => setShowModal(false) }>
            Cancel
          </Button>
          <Button variant="primary" onClick={ () => processBusiness('add', phone) }>
            Add
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
  )
}

export default YelpPage
