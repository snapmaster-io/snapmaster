import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../utils/api'
import LogsTable from '../components/LogsTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const LogsPage = () => {
  const { get } = useApi();
  const [logs, setLogs] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'Logs';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`logs`);

      if (error || !response.ok) {
        setLoading(false);
        setLogs(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setLogs(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !logs) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if no logs, put up a banner
  if (logs && logs.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No logs yet..." />
    )
  }
  
  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        logs && logs.length > 0 && <LogsTable logs={logs} />
      } 
    </div>
  )
}  

export default LogsPage