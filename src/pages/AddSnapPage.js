import React, { useState } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useProfile } from '../utils/profile'
import { serializeSnap, parseDefinition, parseName } from '../utils/snapdef'
import { Tabs, Tab, Button, Modal } from 'react-bootstrap'
import SnapCodeEditor from '../components/SnapCodeEditor'
import SnapEditor from '../components/SnapEditor/SnapEditor'

const AddSnapPage = () => {
  const { post } = useApi();
  const { profile } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();  
  const [key, setKey] = useState('code');
  const [snap, setSnap] = useState();
  const [name, setName] = useState('change-me');
  const [definition, setDefinition] = useState();
  const initialDefinition = `---
version: snap-v1alpha1 
name: change-me
description: change me too
trigger: 
actions:
parameters:
config:
`;

  // initialize the snap definition if it's empty
  if (!definition) {
    setDefinition(initialDefinition);
    const parsedSnap = parseDefinition(initialDefinition, false);
    setSnap(parsedSnap);
  }

  // initialize account and name
  const account = profile && profile.account;

  const save = async () => {
    let text = definition;
    if (!definition.startsWith('---\nversion: snap-v1alpha1')) {
      text = `---
version: snap-v1alpha1
${definition}`;
    }

    // post the fork request to the snaps endpoint
    const request = {
      action: 'create',
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
    navigate('/snaps/mysnaps');
  }

  // snap and definition are isomorphic object / textual formats
  const changeSnap = (snap) => {
    setSnap(snap);
    setDefinition(serializeSnap(snap));
    setName(snap.name);
  }

  const changeDefinition = (definition) => {
    setDefinition(definition);

    const newName = parseName(definition);
    if (newName !== name) {
      setName(newName);
      snap.name = newName;
      setSnap(snap);
    }

    const parsedSnap = parseDefinition(definition, true);
    if (parsedSnap) {
      setSnap(parsedSnap);
      setName(parsedSnap.name);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h4 className="page-title" style={{ minWidth: 300 }}>
          { account && `${account}/` }
          { name || '[add name: property to name this snap]'}
        </h4>
        <div style={{ marginLeft: 50 }}>
          <Button disabled={!name} onClick={save}><i className="fa fa-save"></i>&nbsp;&nbsp;Save</Button>
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

export default AddSnapPage