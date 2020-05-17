import React, { useState, useCallback, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { CardDeck, Card } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import HighlightCard from '../components/HighlightCard'
import SnapCard from '../components/SnapCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ProviderFilter from '../components/ProviderFilter'
import PublishedFilter from '../components/PublishedFilter';

const MySnapsPage = () => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const { connections } = useConnections();
  const [mySnaps, setMySnaps] = useState();
  const [loading, setLoading] = useState(true);
  const [checkboxState, setCheckboxState] = useState();
  const [publishedCheckboxState, setPublishedCheckboxState] = useState();
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

  // create an array of providers
  const providers = connections.map(c => c.provider);
  
  // extract the set of providers that are checked by the ProviderFilter control
  let checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);
  if (checkedProviders && checkedProviders.length === 0) {
    // if nothing is selected, behave as if everything is selected
    checkedProviders = providers;
  }

  // extract the set of published state that are checked by the PublishedFilter control
  let showPublic = publishedCheckboxState && publishedCheckboxState.public.state;
  let showPrivate = publishedCheckboxState && publishedCheckboxState.private.state;
  if (!showPublic && !showPrivate) {
    // if nothing is selected, behave as if everything is selected
    showPublic = true;
    showPrivate = true;
  }

  const snaps = mySnaps && checkedProviders && mySnaps
    .filter(s => checkedProviders.find(p => p === s.provider))
    .filter(s => (showPrivate && s.private) || (showPublic && !s.private))
    .map(s => {
      const [userId, name] = s.snapId.split('/');
      return {
        snapId: s.snapId,
        userId: userId,
        name: name,
        description: s.description,
        provider: s.provider,
        actions: s.actions,
        config: s.config,
        url: s.url,
        private: s.private
      }
    });

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
        { mySnaps && mySnaps.length > 0 && 
          <div style={{ marginLeft: 106 }}>
            <ProviderFilter 
              providers={connections}
              checkboxState={checkboxState}
              setCheckboxState={setCheckboxState}
              initialState={false}
              />
          </div>
        }
        { mySnaps && mySnaps.length > 0 && 
          <div style={{ marginLeft: 20 }}>
            <PublishedFilter 
              checkboxState={publishedCheckboxState}
              setCheckboxState={setPublishedCheckboxState}
              initialState={true}
              />
          </div>
        }
      </div>    

      <CardDeck>
        { snaps && 
          snaps.map(snap => 
            <SnapCard 
              key={snap.snapId} 
              snap={snap} 
              currentUser={user.sub} 
              deleteAction={(e) => handleDelete(e, snap.snapId)}
            />)
        }
        { mySnaps && 
          <HighlightCard className="text-center" onClick={ () => { navigate('/snaps/add') }}
            key='add' 
            style={{ minWidth: '230px', maxWidth: '230px', minHeight: '230px', maxHeight: '230px' }}>
            <Card.Header style={{ minHeight: 60 }}>Add a new snap</Card.Header>
            <Card.Body>
              <i className="fa fa-fw fa-plus" style={{ fontSize: '6em' }} />
            </Card.Body>
          </HighlightCard>
        }
      </CardDeck>        
    </div>
  )
}

export default MySnapsPage