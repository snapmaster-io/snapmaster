import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { providerTitle } from '../utils/strings'
import ProviderDetails from '../components/ProviderDefinition/ProviderDetails'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle';
import ServiceDownBanner from '../components/ServiceDownBanner'
import DisconnectButton from '../components/DisconnectButton'

const ProviderPage = ({provider}) => {
  const { get } = useApi();
  const [data, setData] = useState();  
  const [loading, setLoading] = useState(false);  
  const pageTitle = provider && provider.title && providerTitle(provider.title);
  const entity = provider.definition && provider.definition.connection && provider.definition.connection.entity;
  const endpoint = entity && `entities/${entity}`;

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(endpoint);

      if (error || !response.ok) {
        setData(null);
        setLoading(false);
        return;
      }
  
      const items = await response.json();
      setData(items);
      setLoading(false);
    }
    // only load the entity if it exists
    if (endpoint) {
      call();
    }
  }, [get, endpoint]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);


  // if there is no snap data to display, show a message instead
  if (endpoint && !loading && !data) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <div style = {{ minWidth: 230 }}>
          <PageTitle usePathAsBreadcrumb title={pageTitle} />
        </div>
        <div style={{ marginLeft: 50 }}>
          <DisconnectButton connection={provider} redirectUrl={`${window.location}/definition`} />
        </div>
      </div>
      <ProviderDetails provider={provider} data={data} setData={setData} loading={loading} />
    </div>
  )
}

export default ProviderPage

