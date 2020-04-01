import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../utils/api'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'
import StackedBarChart from '../components/StackedBarChart'

const HistoryPage = () => {
  const { get } = useApi();
  const [logs, setLogs] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'History';

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

  // normalize the log timestamps into days
  var options = { year: '2-digit', month: '2-digit', day: '2-digit' };  
  const logData = logs && logs.map(l => { 
    return { ...l, date: new Date(l.timestamp).toLocaleDateString("en-US", options) } 
  });

  // get the set of all days represented in the log data
  const logDays = (logData && [...new Set(logData.map(l => l.date))]) || [];
  const sortedDays = logDays.sort((a, b) => {
    const aTime = new Date(a).getTime();
    const bTime = new Date(b).getTime();
    return (aTime < bTime ? -1 : bTime < aTime ? 1 : 0);
  });

  // get the set of all active snaps represented in the log data
  const snaps = (logData && [...new Set(logData.map(l => l.snapId))]) || [];

  // construct completed array
  const completedArray = [];
  for (const day of sortedDays) {
    const dayEntry = { date: day };
    for (const snap of snaps) {
      const completed = logData.filter(l => l.date === day && l.state === 'complete' && l.snapId === snap).length;
      dayEntry[snap] = completed;
    }
    completedArray.push(dayEntry);
  }

  // construct error array
  const errorArray = [];
  for (const day of sortedDays) {
    const dayEntry = { date: day };
    for (const snap of snaps) {
      const error = logData.filter(l => l.date === day && l.state !== 'complete' && l.snapId === snap).length;
      dayEntry[snap] = error;
    }
    errorArray.push(dayEntry);
  }

  const barColors = ['#8884d8', "#82ca9d", '#dc3545', '#dc3545', '#ffc107', '#28a745'];
  const bars = snaps.map((s, index) => {
    return {
      key: s,
      dataKey: s,
      stackId: "a",
      fill: barColors[index]
    }
  });

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      <div style={{ display: 'flex' }}>
      { 
        completedArray &&
        <StackedBarChart 
          data={completedArray}
          dataKey="date"
          bars={bars}
          width='45%'
          height={400}
          margin={20}  
        />
      }
      { 
        errorArray &&
        <StackedBarChart 
          data={errorArray}
          dataKey="date"
          bars={bars}
          width='45%'
          height={400}
          margin={20}
        />
      }
      </div>
      <div style={{ display: 'flex', width: 'calc(100vw)' }}>
        <center style={{ marginTop: 10, marginBottom: 10, width: '45%' }}><h2>Completed</h2></center>
        <center style={{ marginTop: 10, marginBottom: 10, width: '40%' }}><h2>Errors</h2></center>
      </div>
    </div>
  )
}  

export default HistoryPage