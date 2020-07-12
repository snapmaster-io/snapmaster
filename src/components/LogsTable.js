import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import Highlight from '../components/Highlight'
import DataTable from '../components/DataTable'

const LogsTable = ({logs}) => {
  const [logEntry, setLogEntry] = useState();
  const [showModal, setShowModal] = useState();

  const actionsFormatter = (cell) => 
  <div>
    { cell && cell.map && cell.map((a, i) => 
        <span key={i}><span style={{ fontWeight: 400 }}>{a.provider}:{a.action}</span>: &nbsp;{a.state};&nbsp;&nbsp;</span>
      )
    }
  </div>

const toolFormatter = (cell) => 
  <i className={ `cloudfont-${ cell }`} style={{ fontSize: '1.5em'}} />

const timestampFormatter = (cell) => new Date(cell).toLocaleString();

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
    <DataTable
      columns={columns}
      data={logs}
      keyField="timestamp"
      rowEvents={rowEvents}
    /> 

    <Modal show={showModal} dialogClassName="modal-90w" onHide={ () => setShowModal(false) }>
      <Modal.Header closeButton>
        <Modal.Title>Log Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      { logEntry && <Highlight style={{ maxHeight: 'calc(70vh)' }}>{JSON.stringify(logEntry, null, 2)}</Highlight> }
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

export default LogsTable