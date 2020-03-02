import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import { Button } from 'react-bootstrap'

const ActiveSnapsPage = () => {
  const { get, post } = useApi();
  const [activeSnaps, setActiveSnaps] = useState();
  const [loading, setLoading] = useState();
  const pageTitle = 'Active Snaps';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('activesnaps');

      if (error || !response.ok) {
        setLoading(false);
        setActiveSnaps(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setActiveSnaps(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if there is no gallery to display, show a message instead
  if (!loading && (!activeSnaps || activeSnaps.length === 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={loading}/>
          <PageTitle title={pageTitle} />
        </div>
        {
          activeSnaps && activeSnaps.length === 0 &&
          <span>No active snaps yet :)  Browse the Gallery to find and activate snaps!</span>
        }
        {
          !activeSnaps && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
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

  const deactivateFormatter = (cell, row) => {
    return (
      <Button className="btn btn-danger" onClick={ () => deactivate(row.activeSnapId)}>
        <i className="fa fa-remove" />&nbsp;&nbsp;Deactivate
      </Button>
    )
  }

  const deactivate = async (activeSnapId) => {
    // post the deactivate request to the activesnaps endpoint
    const request = {
      action: 'deactivate',
      snapId: activeSnapId
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    const newActiveSnaps = activeSnaps.filter(a => a.activeSnapId !== activeSnapId);
    setActiveSnaps(newActiveSnaps);
  }

  const dataRows = activeSnaps && activeSnaps.map(s => {
    const userId = s.snapId.split('/')[0];
    const name = s.snapId.split('/')[1];
    return {
      activeSnapId: s.activeSnapId,
      snapId: s.snapId,
      name: name,
      userId: userId,
      url: s.url
    }
  });

  const columns = [{
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
  }, {
    dataField: 'params',
    text: 'Parameters'
  }, {
    dataField: 'activeSnapId',
    text: 'Actions',
    formatter: deactivateFormatter
  }];  

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
      </div>
      { 
        dataRows ? 
        <DataTable
          columns={columns}
          data={dataRows}
          keyField="activeSnapId"
          //rowEvents={rowEvents}
        /> :
        <div/>
      }
    </div>
  )
}  

export default ActiveSnapsPage