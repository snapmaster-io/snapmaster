import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import RedirectBanner from '../components/RedirectBanner'
import ActionDefinition from '../components/ActionDefinition/ActionDefinition'

const ActionDefinitionPage = ({actionId}) => {
  const { get } = useApi();
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState();
  const [notFound, setNotFound] = useState(false);

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`actions/${actionId}`);

      if (error || !response.ok) {
        setAction(null);
        setLoading(false);
        return;
      }
      
      const item = await response.json();
      if (item && !item.error) {
        setAction(item.data);  
      } else {
        console.error(item && item.message);
        setAction(null);
        setNotFound(true);
      }

      setLoading(false);
    }
    call();
  }, [get, actionId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the action wasn't found, display a redirect banner
  if (notFound) {
    return (
      <RedirectBanner
      loadData={loadData}
      loading={loading}
      pageTitle={actionId}
      messageText="Action not found"
      redirectUrl="/snaps/myactions"
      anchorText="My Actions page"
      redirectText="to manage your actions." />
    )
  }

  // if the service is down, show the banner
  if (!loading && !action) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={actionId}/>
    )
  }

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle 
          title={actionId} 
          breadcrumbText='My Actions'
          breadcrumbUrl='/snaps/myactions'
          />
      </div>
      <h4>
        <i className={`cloudfont-${action && action.provider}`} style={{ fontSize: '1em' }} />&nbsp;&nbsp;
        <a href={`${action && action.url}/__metadata`} target="_action">{action && action.description}</a>
      </h4>
      <br />
      { action && <ActionDefinition action={action} /> }
    </div>
  )
}

export default ActionDefinitionPage

