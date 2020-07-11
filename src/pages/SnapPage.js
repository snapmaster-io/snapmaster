import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { navigate } from 'hookrouter'
import { Button, Modal } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapDefinition from '../components/SnapDefinition/SnapDefinition'
import RedirectBanner from '../components/RedirectBanner'

const SnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const [loading, setLoading] = useState();
  const [snap, setSnap] = useState();
  const [editingPrivacy, setEditingPrivacy] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`snaps/${snapId}`);

      if (error || !response.ok) {        
        setSnap(null);
        setLoading(false);
        return;
      }
      
      const item = await response.json();
      if (item && !item.error) {
        setSnap(item.data);  
      } else {
        console.error(item && item.message);
        setSnap(null);
        setNotFound(true);
      }

      setLoading(false);
    }
    call();
  }, [get, snapId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the snap wasn't found, display a redirect banner
  if (notFound) {
    return (
      <RedirectBanner
      loadData={loadData}
      loading={loading}
      pageTitle={snapId}
      messageText="Snap not found"
      redirectUrl="/snaps/gallery"
      anchorText="Gallery"
      redirectText="to find and activate snaps!" />
    )
  }

  // if the service is down, show the banner
  if (!loading && !snap) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={snapId}/>
    )
  }

  const edit = async () => {
    navigate(`/snaps/editor/${snapId}`);
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

    const item = await response.json();      
    if (item && !item.error && item.data && item.data.snapId) {
      navigate(`/snaps/${item.data.snapId}`);
    } else {
      const message = (item && item.message) || 'fork operation failed';
      setError(message);
      setShowModal(true);
    }
  }

  const userId = snap && snap.userId; 
  const isMySnap = userId && userId === user.sub;

  const flipPrivacyStatus = async () => {
    setEditingPrivacy(true);

    const request = {
      action: 'edit',
      snapId: snapId,
      private: !snap.private
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      setEditingPrivacy(false);
      return;
    }

    const item = await response.json();   
    if (item && !item.error && item.data) {
      setSnap(item.data);
    } else {
      const message = (item && item.message) || 'operation failed';
      setError(message);
      setShowModal(true);
    }

    setEditingPrivacy(false);
  }

  const privacyIcon = (privateStatus) => editingPrivacy ? 'spinner' : (privateStatus ? 'users' : 'lock' );

  const PrivacyButton = ({privateStatus}) => 
    <Button style={{ marginLeft: 20}} onClick={flipPrivacyStatus}>
      <span>
        <i className={`fa fa-${privacyIcon(privateStatus)}`} />&nbsp;&nbsp;
        {privateStatus ? 'Publish' : 'Make private'}
      </span>
    </Button>

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle 
          title={snapId} 
          breadcrumbText={isMySnap ? 'My Snaps' : 'Gallery' }
          breadcrumbUrl={isMySnap ? '/snaps/mysnaps' : '/snaps/gallery' }
          />
        <div style={{ marginLeft: 50 }}>
        { userId && !isMySnap && <Button onClick={fork}><i className="fa fa-code-fork"></i>&nbsp;&nbsp;Fork</Button> }
        { userId && isMySnap && <Button onClick={edit}><i className="fa fa-edit"></i>&nbsp;&nbsp;Edit</Button> }
        { userId && isMySnap && <PrivacyButton privateStatus={isMySnap && snap.private} /> }
        </div>
      </div>
      <SnapDefinition snap={snap} />

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

export default SnapPage