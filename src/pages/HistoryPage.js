import React, { useState } from 'react'
import { useApi } from '../utils/api'
import Loading from '../components/Loading'
import ProviderFilter from '../components/ProviderFilter'
import StackedAreaChart from '../components/StackedAreaChart'
import StackedLineChart from '../components/StackedLineChart'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'

const HistoryPage = () => {
  const { get } = useApi();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [checkboxState, setCheckboxState] = useState();
  const [refresh, setRefresh] = useState(false);
  const [providers, setProviders] = useState();
  const pageTitle = 'History';

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }

  // load history data
  const loadData = async () => { 
    setLoading(true);
    setRefresh(true);

    const [response, error] = await get('history');
    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setHistory(null);
      setRefresh(false);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setRefresh(false);
    setHistory(responseData);
  };

  // if haven't loaded profile yet, do so now
  if (!loadedData && !loading) {
    loadData();
  }

  // if there is no history data to display, show a message instead
  if (loadedData && (!history || !history.length > 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={refresh}/>
          <PageTitle title={pageTitle} />
        </div>
        {
          history && history.length === 0 &&
          <span>No history yet :)</span>
        }
        {
          !history && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
    )
  }

  const sentimentValues = ['negative', 'neutral', 'positive'];
  const colors = ['#dc3545', '#ffc107', '#28a745'];

  // get the set of unique providers returned in metadata, if haven't yet
  if (!providers && history && history.length > 0) {
    const set = new Set();
    for (const h of history) {
      const keys = Object.keys(h).filter(k => 
        k !== 'timestamp' && k !== 'averageScore' && 
        !sentimentValues.find(v => v === k));
      keys.forEach(set.add, set);
    }
    setProviders(Array.from(set));
    return;
  }

  // extract the set of providers that are checked by the ProviderFilter control
  const checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);
  
  // set up areas definitions and data for all sentiment stacked column charts

  // areas for StackedAreaChart showing composite of all sentiments over time
  const areas = sentimentValues.map((sentiment, index) => {
    return {
      dataKey: sentiment,
      stackId: "a",
      fill: colors[index]
    }
  });

  // prepare data by converting timestamp to a date
  var options = { year: '2-digit', month: '2-digit', day: '2-digit' };  
  const allData = history && history.length > 0 && history.map(h => { 
    const date = new Date(h.timestamp).toLocaleDateString("en-US", options)
    return { ...h, date }
  });

  // create an array of provider-specific data
  const providerDataArray = allData && checkedProviders && checkedProviders.map(provider => 
    allData.map(d => {
      return { ...d[provider], date: d.date, provider }
    })
  );
  
  // set up lines definitions and data for sentiment score line chart

  // lines for StackedLineChart showing sentiment scores over time
  const providerColors = ['#8884d8', "#82ca9d", '#dc3545']
  const lines = checkedProviders && checkedProviders.map((provider, index) => {
    return {
      dataKey: provider,
      stroke: providerColors[index]
    }
  });
  // add the line for the total composite score
  lines && lines.push({
    dataKey: 'all',
    stroke: 'blue'
  });

  // prepare data for sentiment score line chart
  const sentimentLineData = allData && checkedProviders && allData.map(d => {
    const entry = { date: d.date };
    for (const p of checkedProviders) {
      if (d[p] && d[p].averageScore !== undefined) {
        entry[p] = Math.round(d[p].averageScore * 100 + 50);
      }
    }
    if (d.averageScore !== undefined) {
      entry.all = Math.round(d.averageScore * 100 + 50);
    }
    return entry;
  });
  
  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={refresh}/>
        <PageTitle title={pageTitle} />
        { 
          providers && 
          <div style={{ marginLeft: 50 }}>
            <ProviderFilter
              providers={providers}
              checkboxState={checkboxState}
              setCheckboxState={setCheckboxState}
              />
          </div>
        }
      </div>

      {
        allData && sentimentLineData &&
        <div style={{ display: 'flex', overflowX: 'hidden' /* horizontal layout */ }}> 
          <StackedAreaChart 
          data={allData}
          dataKey="date"
          areas={areas}
          width={500}
          height={300}
          margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
          />
          <StackedLineChart 
          data={sentimentLineData}
          dataKey="date"
          lines={lines}
          width={500}
          height={300}
          margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
          />
        </div>
      }
    
      <div style={{ display: 'flex', marginTop: 20, overflowX: 'hidden' /* horizontal layout */ }}> 
      { 
        providerDataArray && providerDataArray.map((p, index) => 
          <div key={checkedProviders[index]}>
            <StackedAreaChart 
              key={checkedProviders[index]}
              data={p}
              dataKey="date"
              areas={areas}
              width={350}
              height={250}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              />
            <center style={{ marginTop: 10, marginBottom: 10 }}>
              <i className={`fa fa-fw fa-${checkedProviders[index]} text-muted`} style={{ fontSize: '1.75em' }} />
            </center>
          </div>
        )
      }
      </div>
    </div>
  )
}

export default HistoryPage