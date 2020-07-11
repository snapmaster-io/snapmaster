import React, { useState, useCallback, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { serializeSnap, parseDefinition } from '../utils/snapdef'
import { Tabs, Tab, Button, Modal } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapCodeEditor from '../components/SnapCodeEditor'
import SnapEditor from '../components/SnapEditor/SnapEditor'

const EditSnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const [loading, setLoading] = useState(true);
  const [snap, setSnap] = useState();
  const [definition, setDefinition] = useState();
  const [key, setKey] = useState('code');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();  

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`snaps/${snapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setSnap(null);
        setDefinition(null);
        return;
      }
  
      const item = await response.json();
      if (item && !item.error && item.data) {
        setDefinition(item.data.text);
        setSnap(parseDefinition(item.data.text));  
      }

      setLoading(false);
    }
    call();
  }, [get, snapId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !snap) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={snapId}/>
    )
  }

  const save = async () => {
    let text = definition;
    if (!definition.startsWith('---\nversion: snap-v1alpha1')) {
      text = `---
version: snap-v1alpha1
${definition}`;
    }

    // post the edit request to the snaps endpoint
    const request = {
      action: 'edit',
      snapId: snapId,
      definition: text
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    } 

    const item = await response.json();
    if (item.error || !item.data || !item.data.snapId) {
      setError(item.message);
      setShowModal(true);
      return;
    } else {
      navigate(`/snaps/${item.data.snapId}`);
    }
  }

  const exit = () => {
    navigate(`/snaps/${snapId}`);
  }

  // snap and definition are isomorphic object / textual formats
  const changeSnap = (snap) => {
    setSnap(snap);
    setDefinition(serializeSnap(snap));
  }

  const changeDefinition = (definition) => {
    setDefinition(definition);
    const parsedSnap = parseDefinition(definition, true);
    if (parsedSnap) {
      setSnap(parsedSnap);
    }
  }

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title" style={{ minWidth: 300 }}>{snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          <Button onClick={save}><i className="fa fa-save"></i>&nbsp;&nbsp;Save</Button>
        </div>
        <div style={{ marginLeft: 20 }}>
          <Button onClick={exit}><i className="fa fa-times"></i>&nbsp;&nbsp;Exit</Button>
        </div>
      </div>

      <Tabs activeKey={key} onSelect={k => setKey(k)}>
        <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
          <SnapCodeEditor definition={definition} setDefinition={changeDefinition} />
        </Tab>
        <Tab eventKey="visual" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Visual</span>}>
          <SnapEditor snap={snap} setSnap={changeSnap} />
        </Tab>
      </Tabs>

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

export default EditSnapPage