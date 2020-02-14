import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useMetadata } from '../utils/metadata'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import ProviderFilter from '../components/ProviderFilter'
import PageTitle from '../components/PageTitle'

const AlertsPage = () => {
  const { loadMetadata, loading } = useMetadata();
  const [metadata, setMetadata] = useState();
  const [checkboxState, setCheckboxState] = useState();
  const [providers, setProviders] = useState();

  // create a callback function that wraps the loadMetadata effect
  const loadMeta = useCallback(() => {
    async function call() {
      const meta = await loadMetadata();
      setMetadata(meta);
    }
    call();
  }, [loadMetadata]);

  // load metadata automatically on first page render
  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  // get the set of unique providers returned in metadata, if haven't yet
  if (!providers && metadata && metadata.length > 0) {
    const list = metadata.map(m => m.__provider);
    setProviders([...new Set(list)]);
    return;
  }

  // if there is no metadata / alerts to display, show a message instead
  if (!loading && (!metadata || metadata.length === 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadMetadata} loading={loading}/>
          <h4 className="page-title">Unhandled feedback</h4>
        </div>
        {
          metadata && metadata.length === 0 &&
          <span>No alerts yet :)</span>
        }
        {
          !metadata && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
    )
  }

  const formatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ formatExtraData[cell] } />
    )
  }

  const columns = [{
    dataField: 'provider',
    text: 'Source',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    },
    align: 'center',
    formatter: formatter,
    formatExtraData: {
      facebook: 'fa fa-facebook fa-2x text-muted',
      twitter: 'fa fa-twitter fa-2x text-muted',
      yelp: 'fa fa-yelp fa-2x text-muted',
      'google-oauth2': 'fa fa-google fa-2x text-muted',
      instagram: 'fa fa-instagram fa-2x text-muted'
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '80px' };
    },
    align: 'center',
    formatter: formatter,
    formatExtraData: {
      positive: 'fa fa-thumbs-up fa-2x text-success',
      neutral: 'fa fa-minus fa-2x text-warning',
      negative: 'fa fa-thumbs-down fa-2x text-danger'
    }
  }, {
    dataField: 'text',
    text: 'Text'
  }];

  // extract the set of providers that are checked by the ProviderFilter control
  const checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);

  // create the alerts array, which only contains unhandled entries of checked providers
  const alerts = checkedProviders && metadata && metadata.map && 
    metadata
      .filter(a => a.__handled !== true && checkedProviders.find(p => p === a.__provider))
      .map(item => {
    return {
      id: item.__id, 
      type: item.__sentiment,
      provider: item.__provider, 
      text: item.__text,
      handled: item.__handled
    }
  });

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate(`/sources/${row.provider}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadMeta} loading={loading}/>
        <PageTitle title="Unhandled feedback" />
        <div style={{ marginLeft: 50 }}>
          <ProviderFilter 
            providers={providers}
            checkboxState={checkboxState}
            setCheckboxState={setCheckboxState}
            />
        </div>
      </div>
      { 
        alerts ? 
        <DataTable
          columns={columns}
          data={alerts}
          keyField="id"
          rowEvents={rowEvents}
        /> :
        <div/>
      }
    </div>
  )
}

export default AlertsPage