import React, { useState } from 'react'
import { useApi } from '../utils/api'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import DataTable from '../components/DataTable'
import { Button } from 'react-bootstrap'
import { navigate } from 'hookrouter'

const MySnapsPage = () => {
  const { get } = useApi();
  const [mySnaps, setMySnaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const pageTitle = 'My Snaps';

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }

  // load snaps data
  const loadData = async () => { 
    setLoading(true);
    setRefresh(true);

    const [response, error] = await get('snaps');
    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setMySnaps(null);
      setRefresh(false);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setRefresh(false);
    setMySnaps(responseData);
  };

  // if haven't loaded snaps yet, do so now
  if (!loadedData && !loading) {
    loadData();
  }

  // if there is no snaps data to display, show a message instead
  if (loadedData && (!mySnaps || !mySnaps.length > 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={refresh}/>
          <PageTitle title={pageTitle} />
        </div>
        {
          mySnaps && mySnaps.length === 0 &&
          <span>You don't have any snaps yet.  Create a new snap or fork one from the Gallery :)</span>
        }
        {
          !mySnaps && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
    )
  }

  const urlFormatter = (cell, row) => {
    if (row.url) {
      return <a href={row.url} target="_">{cell}</a>
    } else {
      return (
        <Button onClick={ () => { navigate(`/snaps/${row.userId}/${row.name}`) }}>
          {`View definition`} 
        </Button>
      )
    }
  }

  const dataRows = mySnaps && mySnaps.map(s => {
    const userId = s.snapId.split('/')[0];
    const name = s.snapId.split('/')[1];
    return {
      name: name,
      userId: userId,
      private: s.private,
      url: s.url
    }
  });

  const columns = [{
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '250px' };
    }
  }, {
    dataField: 'private',
    text: 'Private?',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    },
  }, {
    dataField: 'url',
    text: 'Definition',
    formatter: urlFormatter
  }];  
  
  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={refresh}/>
        <PageTitle title={pageTitle} />
      </div>
    
      <DataTable 
        columns={columns} 
        data={dataRows} 
        keyField='name' />
    </div>
  )
}

export default MySnapsPage