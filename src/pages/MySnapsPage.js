import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import SnapCard from '../components/SnapCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const MySnapsPage = () => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const [mySnaps, setMySnaps] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'My Snaps';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('snaps');

      if (error || !response.ok) {
        setLoading(false);
        setMySnaps(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setMySnaps(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !mySnaps) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if no tools connected, return a banner to connect tools
  if (mySnaps && mySnaps.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="You don't have any snaps yet..."
        redirectUrl="/snaps/gallery"
        anchorText="Gallery"
        redirectText="to fork your own snaps!" />
    )
  }
  /* You don't have any snaps yet.  Create a new snap or fork one from the Gallery :) */

  const handleDelete = async (e, snapId) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    // post the delete request to the snaps endpoint
    const request = {
      action: 'delete',
      snapId: snapId
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    const newSnaps = mySnaps.filter(a => a.snapId !== snapId);
    setMySnaps(newSnaps);
  }
  
  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>

      { mySnaps && 
        mySnaps.map(snap => 
          <SnapCard 
            key={snap.snapId} 
            snap={snap} 
            currentUser={user.sub} 
            deleteAction={(e) => handleDelete(e, snap.snapId)}
          />)
      }
    </div>
  )
}

export default MySnapsPage