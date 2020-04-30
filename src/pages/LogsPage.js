import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../utils/api'
import { Modal, Button } from 'react-bootstrap'
import Highlight from '../components/Highlight'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const LogsPage = () => {
  const { get } = useApi();
  const [logs, setLogs] = useState();
  const [logEntry, setLogEntry] = useState();
  const [showModal, setShowModal] = useState();
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

  const actionsFormatter = (cell, row) => {
    return (
      <div>
        { cell && cell.map && cell.map(a => 
            <span key={a.name}><span style={{ fontWeight: 400 }}>{a.provider}</span>: &nbsp;{a.state};&nbsp;&nbsp;</span>
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

  /*
  const dataRows = logs && logs.map && logs.map(s => {
    return {
      activeSnapId: s.activeSnapId,
      timestamp: s.timestamp,
      snapId: s.snapId,
      state: s.state,
      trigger: s.trigger,
      actions: s.actions,
      params: s.params
    }
  });
  */

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
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '90px' };
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
        logs && logs.length > 0 &&
        <DataTable
          columns={columns}
          data={logs}
          keyField="timestamp"
          rowEvents={rowEvents}
        /> 
      }

      <Modal show={showModal} dialogClassName="modal-50w" onHide={ () => setShowModal(false) }>
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

export default LogsPage