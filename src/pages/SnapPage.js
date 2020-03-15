import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapDefinition from '../components/SnapDefinition'

const SnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const [loading, setLoading] = useState();
  const [snap, setSnap] = useState();

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`snaps/${snapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setSnap(null);
        return;
      }
  
      const item = await response.json();
      setLoading(false);
      setSnap(item);
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

  const fork = async () => {
    // post the fork request to the snaps endpoint
    const request = {
      action: 'fork',
      snapId: snapId
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    navigate('/snaps/mysnaps');
  }

  const userId = snap && snap.userId; 

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{snap && snap.snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          { userId !== user.sub && <Button onClick={ fork }><i className="fa fa-code-fork"></i>&nbsp;&nbsp;Fork</Button> }
        </div>
      </div>
      <SnapDefinition snap={snap} />
    </div>
  )
}

export default SnapPage