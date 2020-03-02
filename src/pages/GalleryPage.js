import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import { Button } from 'react-bootstrap'

const GalleryPage = () => {
  const { get } = useApi();
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState();
  const pageTitle = 'Gallery';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('gallery');

      if (error || !response.ok) {
        setLoading(false);
        setGallery(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setGallery(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if there is no gallery to display, show a message instead
  if (!loading && (!gallery || gallery.length === 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={loading}/>
          <PageTitle title={pageTitle} />
        </div>
        {
          gallery && gallery.length === 0 &&
          <span>No gallery yet :)</span>
        }
        {
          !gallery && 
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
        <Button onClick={ () => { navigate(`/snaps/${row.snapId}`) }}>
          {`View definition`} 
        </Button>
      )
    }
  }

  const dataRows = gallery && gallery.map(s => {
    const userId = s.snapId.split('/')[0];
    const name = s.snapId.split('/')[1];
    return {
      snapId: s.snapId,
      name: name,
      userId: userId,
      private: s.private,
      url: s.url
    }
  });

  const columns = [{
    dataField: 'userId',
    text: 'Namespace',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '300px' };
    }
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '250px' };
    }
  }, {
    dataField: 'url',
    text: 'Definition',
    formatter: urlFormatter
  }];  

  /*
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate(`/snaps/${row.snapId}`);
    }
  };
  */
  
  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        dataRows ? 
        <DataTable
          columns={columns}
          data={dataRows}
          keyField="snapId"
          //rowEvents={rowEvents}
        /> :
        <div/>
      }
    </div>
  )
}  

export default GalleryPage