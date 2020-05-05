import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { CardDeck } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ProviderFilter from '../components/ProviderFilter'
import SnapCard from '../components/SnapCard'

const SnapCardDeck = ({snapsData, pageTitle, loading, loadData}) => {
  const { connections } = useConnections();
  const { user } = useAuth0();
  const [checkboxState, setCheckboxState] = useState();

  // create an array of providers
  const providers = connections.map(c => c.provider);
  
  // extract the set of providers that are checked by the ProviderFilter control
  let checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);
  if (checkedProviders && checkedProviders.length === 0) {
    // if nothing is selected, behave as if everything is selected
    checkedProviders = providers;
  }

  const snaps = snapsData && checkedProviders && snapsData
    .filter(s => checkedProviders.find(p => p === s.provider))
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
        url: s.url
      }
    });
  
  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
        <div style={{ marginLeft: 130 }}>
          <ProviderFilter 
            providers={connections}
            checkboxState={checkboxState}
            setCheckboxState={setCheckboxState}
            initialState={false}
            />
        </div>
      </div>
      <CardDeck>
      { 
        snaps &&
        snaps.map(snap => <SnapCard key={snap.snapId} snap={snap} currentUser={user.sub} />)
      }
      </CardDeck>
    </div>
  )
}  

export default SnapCardDeck