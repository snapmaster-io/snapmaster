import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../../utils/api'
import StackedBarChart from '../StackedBarChart'

const HistoryTab = ({activeSnap}) => {
  const { get } = useApi();
  const [logs, setLogs] = useState();
  const [loading, setLoading] = useState(true);

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`logs/${activeSnap.activeSnapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setLogs(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setLogs(items);
    }
    activeSnap && call();
  }, [get, activeSnap]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !logs) {
    return (
      <h4>The service appears to be down - please try refresing the page</h4>
    )
  }

  // if no logs, put up a banner
  if (logs && logs.length === 0) {
    return (
      <h4>No history yet...</h4>
    )
  }
  
  // normalize the log timestamps into days
  var options = { year: '2-digit', month: '2-digit', day: '2-digit' };  
  const logData = logs && logs.map(l => { 
    return { ...l, date: new Date(l.timestamp).toLocaleDateString("en-US", options) } 
  });

  // get the set of all days represented in the log data
  const logDays = (logData && [...new Set(logData.map(l => l.date))]) || [];

  // construct data array
  const dataArray = [];
  for (const day of logDays) {
    const logsInDay = logData.filter(l => l.date === day);
    const completed = logsInDay.filter(l => l.state === 'complete').length;
    const errors = logsInDay.filter(l => l.state !== 'complete').length;
    dataArray.push({
      date: day,
      completed,
      errors
    });
  }

  const bars = [{
    dataKey: 'completed',
    stackId: "a",
    fill: '#28a745'
  }, {
    dataKey: 'errors',
    stackId: "a",
    fill: '#dc3545'
  }];

  return (
    <StackedBarChart 
      data={dataArray}
      dataKey="date"
      bars={bars}
      width='60%'
      height={400}
      margin={{ top: 20 }}  
    />
  )
}

export default HistoryTab
