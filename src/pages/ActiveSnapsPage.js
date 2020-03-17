import React, { useState, useEffect, useCallback } from 'react'
import { navigate, A } from 'hookrouter'
import { useApi } from '../utils/api'
import { Button, Modal } from 'react-bootstrap'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const ActiveSnapsPage = () => {
  const { get, post } = useApi();
  const [activeSnaps, setActiveSnaps] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();
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

  const snapIdFormatter = (cell, row) => <A href={`/snaps/${cell}/${row.activeSnapId}`}>{cell}</A>

  const actionButtonsFormatter = (cell, row) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button className="btn" onClick={ () => navigate(`/snaps/logs/${cell}`)}>
          <i className="fa fa-book" />&nbsp;&nbsp;Logs
        </Button>
        { row.state === 'active' &&
        <Button style={{ marginLeft: 20, width: 101 }} className="btn btn-warning" onClick={ () => invokeAction('pause', cell)}>
          &nbsp;<i className="fa fa-pause" />&nbsp;&nbsp;Pause&nbsp;
        </Button>
        }
        { row.state === 'paused' &&
        <Button style={{ marginLeft: 20, width: 101 }} className="btn btn-success" onClick={ () => invokeAction('resume', cell)}>
          <i className="fa fa-play" />&nbsp;&nbsp;Resume
        </Button>
        }        
        <Button style={{ marginLeft: 20 }} className="btn btn-danger" onClick={ () => invokeAction('deactivate', cell)}>
          <i className="fa fa-remove" />&nbsp;&nbsp;Deactivate
        </Button>
      </div>
    )
  }

  const paramsFormatter = (cell, row) => {
    return (
      <div>
        { row.params && row.params.map(p => 
            <div>
              <span key={p.name}>
                <span style={{ fontWeight: 400 }}>
                  {p.name}
                </span>: &nbsp;{p.value}
              </span>
            </div>
          )
        }
      </div>
    )
  }

  const statusFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ formatExtraData[cell]} style={{ fontSize: '1.5em'}} />
    )  
  }

  const timestampFormatter = (cell) => new Date(cell).toLocaleString();

  const toolFormatter = (cell) => {
    return (
      <i className={ `cloudfont-${cell}`} style={{ fontSize: '1.5em'}} />
    )
  }

  const invokeAction = async (action, activeSnapId) => {
    // post the action request to the activesnaps endpoint
    const request = {
      action,
      snapId: activeSnapId
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    const responseData = await response.json();
    const status = responseData && responseData.message;
  
    if (status !== 'success') {
      setError(status);
      setShowModal(true);
      return;
    }

    // a successful invocation will send a refreshed set of activesnaps
    if (responseData.data) {
      setActiveSnaps(responseData.data);
    }
  }

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
    dataField: 'timestamp',
    text: 'Since',
    headerStyle: (column, colIndex) => {
      return { width: '200px' };
    },
    formatter: timestampFormatter,
  }, {
    dataField: 'snapId',
    text: 'Name',
    sort: true,
    formatter: snapIdFormatter,
  }, {
    dataField: 'counter',
    text: 'Runs',
    headerStyle: (column, colIndex) => {
      return { width: '50px' };
    }
  }, {
    dataField: 'params',
    text: 'Parameters',
    formatter: paramsFormatter
  }, {
    dataField: 'activeSnapId',
    text: 'Actions',
    formatter: actionButtonsFormatter,
    headerStyle: (column, colIndex) => {
      return { width: '355px' };
    }
  }];  
  
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

      <Modal show={showModal} onHide={ () => setShowModal(false) }>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { error }
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

export default ActiveSnapsPage