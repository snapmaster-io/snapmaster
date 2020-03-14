import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { navigate, A } from 'hookrouter'
import { Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapDefinition from '../components/SnapDefinition'

const ActiveSnapPage = ({snapId, activeSnapId}) => {
  const { get } = useApi();
  const [loading, setLoading] = useState(true);
  const [snap, setSnap] = useState();
  const [activeSnap, setActiveSnap] = useState();

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      let [response, error] = await get(`activesnaps/${activeSnapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setActiveSnap(null);
        return;
      }
  
      let item = await response.json();
      setLoading(false);
      setActiveSnap(item);

      // get snap
      [response, error] = await get(`snaps/${snapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setSnap(null);
        return;
      }
  
      item = await response.json();
      setLoading(false);
      setSnap(item);
    }
    call();
  }, [get, snapId, activeSnapId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if there is no snap data to display, show a message instead
  if (!loading && !activeSnap) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={snapId}/>
    )
  }

  // construct page title
  const statusIcon = {
    active: 'fa fa-play fa-lg text-success',
    paused: 'fa fa-pause fa-lg text-warning',
  }
  const statusFormatter = (state) => <i className={ statusIcon[state]} style={{ fontSize: '1.5em'}} />
  const snapIdUrl = <A href={`/snaps/active`}>{snapId}</A>
  const pageTitle = activeSnap ? <span>{statusFormatter(activeSnap.state)} &nbsp;&nbsp;{snapIdUrl}</span> : <span>{snapIdUrl}</span>;

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{pageTitle}</h4>
        <div style={{ marginLeft: 50 }}>
          <Button onClick={ () => navigate(`/snaps/logs/${activeSnapId}`) }><i className="fa fa-book"></i>&nbsp;&nbsp;Logs</Button>
        </div>
      </div>
      <SnapDefinition snap={snap} activeSnap={activeSnap} activeSnapId={activeSnapId} />
    </div>
  )
}

export default ActiveSnapPage