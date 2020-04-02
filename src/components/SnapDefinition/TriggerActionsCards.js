import React from 'react'
import { useConnections } from '../../utils/connections'
import ProviderCard from './ProviderCard'
import StateIcon from './StateIcon'

const TriggerActionsCards = ({snap, state}) => {
  const { connections } = useConnections();

  const triggerProviderName = snap && snap.provider;
  const triggerProvider = triggerProviderName && connections && connections.find(el => el.provider === triggerProviderName);
  const triggerEvent = snap && snap.config && snap.config.find(c => c.name === snap.trigger);
  const triggerInfo = { ...triggerProvider, action: triggerEvent && triggerEvent.event };

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return { providerName: actionConfig.provider, action: actionConfig.action }
  });

  const actionProviders = actionList && actionList.map(a => { 
    const actionProvider = connections && connections.find(el => el.provider === a.providerName);
    // augment the provider with the action name
    return { ...actionProvider, action: a.action }
  });

  return (
    <div>
      <div style={{ display: 'flex' }}>
        { triggerProvider && <ProviderCard providerInfo={triggerInfo} /> }
        { triggerProvider && <StateIcon state={state}/> }
        { actionProviders && actionProviders.map(a => <ProviderCard key={`${a.provider}:${a.action}`} providerInfo={a} />)
        }
      </div>
    </div>
  )
}

export default TriggerActionsCards