import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useConnections } from '../utils/connections'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ProviderFilter from '../components/ProviderFilter'
import { Button } from 'react-bootstrap'

const GalleryPage = () => {
  const { get } = useApi();
  const { connections } = useConnections();
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState();
  const [checkboxState, setCheckboxState] = useState();
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
          <span>No snaps in the gallery yet :)</span>
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

  const toolFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ `cloudfont-${row.trigger }`} style={{ fontSize: '1.5em'}} />
    )
  }

  const columns = [{
    dataField: 'trigger',
    text: 'Trigger',
    headerStyle: (column, colIndex) => {
      return { width: '75px' };
    },
    align: 'center',
    formatter: toolFormatter,
  }, {
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

  // create an array of providers
  const providers = connections.map(c => c.provider);
  
  // extract the set of providers that are checked by the ProviderFilter control
  let checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);
  if (checkedProviders && checkedProviders.length === 0) {
    // if nothing is selected, behave as if everything is selected
    checkedProviders = providers;
  }

  const dataRows = gallery && gallery
    .filter(s => checkedProviders.find(p => p === s.trigger))
    .map(s => {
      const userId = s.snapId.split('/')[0];
      const name = s.snapId.split('/')[1];
      return {
        snapId: s.snapId,
        name: name,
        userId: userId,
        private: s.private,
        trigger: s.trigger,
        url: s.url
      }
    });

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
        <h5 style={{ marginLeft: 50, marginTop: 7 }}>Filter by trigger: </h5>
        <div style={{ marginLeft: 20 }}>
          <ProviderFilter 
            providers={providers}
            checkboxState={checkboxState}
            setCheckboxState={setCheckboxState}
            initialState={false}
            />
        </div>
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