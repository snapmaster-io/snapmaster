import React, { useState, useCallback, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { serializeSnap, parseDefinition } from '../utils/snapdef'
import { Tabs, Tab, Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapCodeEditor from '../components/SnapCodeEditor'
import SnapEditor from '../components/SnapEditor/SnapEditor'

const EditSnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const [loading, setLoading] = useState();
  const [snap, setSnap] = useState();
  const [definition, setDefinition] = useState();
  const [key, setKey] = useState('code');

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
      setLoading(false);
      setDefinition(item.text);
      setSnap(parseDefinition(item.text));
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
    // post the edit request to the snaps endpoint
    const request = {
      action: 'edit',
      snapId: snapId,
      definition: definition
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    } 

    const item = await response.json();
    if (item.message === 'success') {
      //setSnap(item.snap);
      navigate(`/snaps/${item.snap && item.snap.snapId}`);
    } else {
      // TODO: error
    }
  }

  // snap and definition are isomorphic object / textual formats
  const changeSnap = (snap) => {
    setSnap(snap);
    setDefinition(serializeSnap(snap));
  }

  const changeDefinition = (definition) => {
    setDefinition(definition);
    const parsedSnap = parseDefinition(definition);
    if (parsedSnap) {
      setSnap(parsedSnap);
    }
  }

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          <Button onClick={save}><i className="fa fa-save"></i>&nbsp;&nbsp;Save</Button>
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
    </div>
  )
}

export default EditSnapPage