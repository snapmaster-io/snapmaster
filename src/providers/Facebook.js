import React, { useState } from 'react'
import { useApi } from '../utils/api'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import HighlightCard from '../components/HighlightCard'
import FilterTable from '../components/FilterTable'

const FacebookPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Facebook pages'
      connectionName='facebook'
      endpoint='facebook'
      setData={setData}>
      <PageCards data={data} />
    </BaseProvider>
  )
}

const PageCards = ({data}) => {
  const { get } = useApi();
  const [reviewsData, setReviewsData] = useState();
  const [reviews, setReviews] = useState();
  const [selected, setSelected] = useState();

  const getPage = async (id, accessToken) => {
    // store the state associated with the selected page
    setSelected(id);

    const endpoint = `facebook/reviews/${id}`;
    const headers = {
      token: accessToken
    };

    const [response, error] = await get(endpoint, headers);

    if (error || !response.ok) {
      setReviewsData(null);
      setReviews(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      setReviewsData(items);
      const data = items.map(item => {
        return { 
          page_id: id,
          created_time: item.created_time,
          date: new Date(item.created_time).toLocaleString(),
          type: item.recommendation_type,
          text: item.review_text
        } 
      });
      setReviews(data);
    }
  }

  const urlFormatter = (cell, row) => {
    const review = `https://www.facebook.com/${row.page_id}/reviews`;
    return <a href={review} target="_">{cell}</a>
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
    dataField: 'text',
    text: 'Text',
    formatter: urlFormatter
  }];

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
          data && data.map ? data.map((item, key) => {
            const { name, id, access_token} = item;
            const border = (id === selected) ? 'primary' : null;
            const displayName = name.length > 20 ? name.slice(0, 19) + '...' : name;
            const url = `https://www.facebook.com/${id}`;
            const imageUrl = `http://graph.facebook.com/${id}/picture?access_token=${access_token}`;
          
            const loadPageComments = () => {
              getPage(id, access_token);
            }

            return (
              <HighlightCard className="text-center" onClick={loadPageComments} 
                key={key} border={ border ? border : null }
                style={{ maxWidth: '200px' }}>
                <Card.Header>
                  <Card.Link href={url} target="_blank">{displayName}</Card.Link>
                </Card.Header>
                <Card.Body>
                  <Card.Img src={imageUrl} alt={displayName} style={{ maxHeight: 100, maxWidth: 100 }} />
                </Card.Body>
              </HighlightCard>
            )
          })
          : <div/>
        }
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
            keyField="created_time"
            path={`facebook/reviews/${selected}`}
            maxHeight="calc(100vh - 460px)"
            />
        </div> :
        <div/>
      }
    </div>
  )
}

export default FacebookPage
