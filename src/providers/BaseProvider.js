import React, { useState } from 'react'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { Button } from 'react-bootstrap'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'

const BaseProvider = ({ 
    pageTitle, 
    connectionName, 
    endpoint, 
    onLoadHandler,
    setData,
    children
  }) => {

  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [refresh, setRefresh] = useState(false);
  const { get } = useApi();
  const { connections, loadConnections } = useConnections();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }
  
  // load data from provider
  const loadData = async (forceRefresh = false) => { 
    setLoading(true);
    setRefresh(true);

    // invoke the on load handler function if supplied by provider
    onLoadHandler && onLoadHandler();

    // call GET on endpoint
    const [response, error] = await get(endpoint, {}, forceRefresh);
    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setData(null);
      setRefresh(false);
      setErrorMessage("Can't reach service - try refreshing later");
      return;
    }

    // items always come back as an array
    const items = await response.json();

    setLoadedData(true);
    setLoading(false);
    setErrorMessage(null);
    setRefresh(false);
    setData(items);
  }

  const refreshData = async () => {
    if (!connections || !connections.find) {
      await loadConnections();
    } 
    loadData(true);
  }

  // if connections not loaded, set an error message
  if (!connections || !connections.find) {
    return (
      <ServiceDownBanner
        loadData={loadConnections}
        loading={refresh}
        pageTitle={pageTitle}/>
    )
  }

  // find whether we are connected to the provider
  const connection = connections.find(el => el.provider === connectionName);
  if (!connection || !connection.connected) {
    // need to connect first
    const [provider] = pageTitle.split(' ');
    return(
      <div className="page-header">
        <Button onClick={ () => { navigate('/tools/connections') }}>
          {`Connect to ${provider}`} 
        </Button>
      </div>
    )
  }

  // if haven't loaded data yet, do so now
  if (!loadedData && !loading) {
    loadData();
  }

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={refreshData}  loading={refresh}/>
        <PageTitle usePathAsBreadcrumb title={pageTitle} />
      </div>
      <div>
      { errorMessage ? <span>{errorMessage}</span> : children }
      </div>
    </div>
  )
}

export default BaseProvider