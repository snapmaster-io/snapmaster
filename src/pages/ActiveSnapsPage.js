import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const ActiveSnapsPage = () => {
  const { get } = useApi();
  const [activeSnaps, setActiveSnaps] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'Active Snaps';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('activesnaps');

      if (error || !response.ok) {
        setActiveSnaps(null);
      }
  
      const item = await response.json();      
      if (item && item.data) {
        setActiveSnaps(item.data);
      } 
      
      setLoading(false);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if tried to load and failed, show an error
  if (!loading && !activeSnaps) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if there are no active snaps to display, show a message instead
  if (!loading && activeSnaps && activeSnaps.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No active snaps yet..."
        redirectUrl="/snaps/gallery"
        anchorText="Gallery"
        redirectText="to find and activate snaps!" />
    )
  }

  const snapIdFormatter = (cell, row) => <b>{cell}</b>

  const paramsFormatter = (cell) => 
    <div>
      { cell && cell.length && cell.map(p => 
          <div key={p.name}>
            <span><span style={{ fontWeight: 400 }}>{p.name}</span>: &nbsp;{p.value}</span>
          </div>
        )
      }
    </div>

  const statusFormatter = (cell, row, rowIndex, formatExtraData) => 
    <i className={ formatExtraData[cell]} style={{ fontSize: '1.5em'}} />

  const timestampFormatter = (cell) => new Date(cell).toLocaleString();

  const toolFormatter = (cell) => <i className={ `cloudfont-${cell}`} style={{ fontSize: '1.5em'}} />

  const dataRows = activeSnaps && activeSnaps.map(s => {
    const userId = s.snapId.split('/')[0];
    const name = s.snapId.split('/')[1];
    return {
      activeSnapId: s.activeSnapId,
      snapId: s.snapId,
      name: name,
      userId: userId,
      provider: s.provider,
      state: s.state,
      timestamp: s.activated,
      counter: s.executionCounter ? s.executionCounter : 0,
      params: s.params
    }
  });

  const columns = [{
    dataField: 'state',
    text: 'State',
    headerStyle: (column, colIndex) => {
      return { width: '60px' };
    },
    align: 'center',
    formatter: statusFormatter,
    formatExtraData: {
      active: 'fa fa-play fa-2x text-success',
      paused: 'fa fa-pause fa-2x text-warning',
    }
  }, {
    dataField: 'provider',
    text: 'Trigger',
    headerStyle: (column, colIndex) => {
      return { width: '75px' };
    },
    align: 'center',
    formatter: toolFormatter,
  }, {
    dataField: 'counter',
    text: 'Runs',
    headerStyle: (column, colIndex) => {
      return { width: '50px' };
    }
  }, {
    dataField: 'timestamp',
    text: 'Since',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '200px' };
    },
    formatter: timestampFormatter,
  }, {
    dataField: 'snapId',
    text: 'Name',
    sort: true,
    formatter: snapIdFormatter
  }, {
    dataField: 'params',
    text: 'Parameters',
    formatter: paramsFormatter
  }];

  const rowEvents = {
    onClick: (e, row) => {
      navigate(`/snaps/${row.snapId}/${row.activeSnapId}`);
    }
  };
  
  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>
      { 
        dataRows && 
        <DataTable
          columns={columns}
          data={dataRows}
          keyField="activeSnapId"
          rowEvents={rowEvents}
        /> 
      }
    </div>
  )
}  

export default ActiveSnapsPage