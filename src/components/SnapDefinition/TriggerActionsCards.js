import React from 'react'
import { useConnections } from '../../utils/connections'
import ProviderCard from './ProviderCard'
import StateIcon from './StateIcon'

const TriggerActionsCards = ({snap, state}) => {
  const { connections } = useConnections();

  const triggerProviderName = snap && snap.provider;
  const triggerProvider = triggerProviderName && connections && connections.find(el => el.provider === triggerProviderName);

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return actionConfig.provider;
  });

  const actionProviders = actionList && actionList.map(a => { 
    const actionProvider = connections && connections.find(el => el.provider === a);
    return actionProvider;
  });

  return (
    <div>
      <div style={{ display: 'flex' }}>
        { triggerProvider && <ProviderCard provider={triggerProvider} /> }
        { triggerProvider && <StateIcon state={state}/> }
        { actionProviders && actionProviders.map(a => <ProviderCard key={a.provider} provider={a} />)
        }
      </div>
    </div>
  )
}

export default TriggerActionsCards