import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapEditor from '../components/SnapEditor'

const EditSnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const [loading, setLoading] = useState();
  const [snap, setSnap] = useState();
  const [definition, setDefinition] = useState();

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
      setSnap(item);
      setDefinition(item.text);
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
    console.log(`item: ${item.message}`);
    if (item.message === 'success') {
      //setSnap(item.snap);
      navigate(`/snaps/${item.snap && item.snap.snapId}`);
    } else {
      // TODO: error
    }
  }

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{snap && snap.snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          <Button onClick={save}><i className="fa fa-save"></i>&nbsp;&nbsp;Save</Button>
        </div>
      </div>
      <SnapEditor definition={definition} setDefinition={setDefinition}/>
    </div>
  )
}

export default EditSnapPage