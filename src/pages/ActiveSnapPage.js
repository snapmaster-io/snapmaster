import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ActiveSnapDetail from '../components/SnapDefinition/ActiveSnapDetail'

const ActiveSnapPage = ({snapId, activeSnapId}) => {
  const { get, post } = useApi();
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

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={snapId} breadcrumbText='Active Snaps' breadcrumbUrl='/snaps/active' />
      </div>
      <ActiveSnapDetail snap={snap} activeSnap={activeSnap} activeSnapId={activeSnapId} setActiveSnap={setActiveSnap} />
    </div>
  )
}

export default ActiveSnapPage