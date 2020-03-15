import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { Button, CardDeck } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ProviderFilter from '../components/ProviderFilter'
import SnapCard from '../components/SnapCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const GalleryPage = () => {
  const { get } = useApi();
  const { connections } = useConnections();
  const { user } = useAuth0();
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState(true);
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

  // if the service is down, show the banner
  if (!loading && !gallery) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if there is no gallery to display, show a message instead
  if (gallery && gallery.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No snaps in the gallery..." />
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
      <i className={ `cloudfont-${row.provider }`} style={{ fontSize: '1.5em'}} />
    )
  }

  const columns = [{
    dataField: 'provider',
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
    .filter(s => checkedProviders.find(p => p === s.provider))
    .map(s => {
      const [userId, name] = s.snapId.split('/');
      return {
        snapId: s.snapId,
        userId: userId,
        name: name,
        provider: s.provider,
        actions: s.actions,
        config: s.config,
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
      <CardDeck>
      { 
        dataRows &&
        /*<DataTable
          columns={columns}
          data={dataRows}
          keyField="snapId"
          //rowEvents={rowEvents}
        /> */
        dataRows.map(snap => <SnapCard key={snap.snapId} snap={snap} currentUser={user.sub} />)
      }
      </CardDeck>
    </div>
  )
}  

export default GalleryPage