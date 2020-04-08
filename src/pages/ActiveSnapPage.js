import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ActiveSnapDetail from '../components/SnapDefinition/ActiveSnapDetail'

const ActiveSnapPage = ({snapId, activeSnapId}) => {
  const { get } = useApi();
  const [loading, setLoading] = useState(true);
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
    }
    call();
  }, [get, activeSnapId]);

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
      <ActiveSnapDetail activeSnap={activeSnap} activeSnapId={activeSnapId} setActiveSnap={setActiveSnap} />
    </div>
  )
}

export default ActiveSnapPage