import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../utils/api'
import { Modal, Button } from 'react-bootstrap'
import Highlight from '../components/Highlight'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'

const ActiveSnapLogsPage = ({activeSnapId}) => {
  const { get } = useApi();
  const [logs, setLogs] = useState();
  const [logEntry, setLogEntry] = useState();
  const [showModal, setShowModal] = useState();
  const [loading, setLoading] = useState();
  const pageTitle = 'Logs';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`logs/${activeSnapId}`);

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
  }, [get, activeSnapId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if there is no gallery to display, show a message instead
  if (!loading && (!logs || logs.length === 0)) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={loading}/>
          <PageTitle title={pageTitle} />
        </div>
        {
          logs && logs.length === 0 &&
          <span>No logs yet :)</span>
        }
        {
          !logs && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
    )
  }

  const actionsFormatter = (cell, row) => {
    return (
      <div>
        { cell && cell.map && cell.map(a => 
            <span key={a.provider}><span style={{ fontWeight: 400 }}>{a.provider}</span>: &nbsp;{a.state};&nbsp;&nbsp;</span>
          )
        }
      </div>
    )
  }

  const toolFormatter = (cell) => {
    return (
      <i className={ `cloudfont-${ cell }`} style={{ fontSize: '1.5em'}} />
    )
  }

  const timestampFormatter = (cell) => new Date(cell).toLocaleString();

  const dataRows = logs && logs.map(s => {
    return {
      timestamp: s.timestamp,
      snapId: s.snapId,
      state: s.state,
      trigger: s.trigger,
      actions: s.actions,
      params: s.params
    }
  });

  const columns = [{
    dataField: 'timestamp',
    text: 'Timestamp',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '200px' };
    },
    formatter: timestampFormatter,
  }, {
    dataField: 'snapId',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '300px' };
    }
  }, {
    dataField: 'state',
    text: 'State',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '80px' };
    }
  }, {
    dataField: 'trigger',
    text: 'Trigger',
    headerStyle: (column, colIndex) => {
      return { width: '75px' };
    },
    align: 'center',
    formatter: toolFormatter,
  }, {
    dataField: 'actions',
    text: 'Actions',
    formatter: actionsFormatter
  }];  

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setLogEntry(row);
      setShowModal(true);
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

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Log Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { logEntry && <Highlight>{JSON.stringify(logEntry, null, 2)}</Highlight> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={ () => setShowModal(false) }>
            Close
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
  )
}  

export default ActiveSnapLogsPage