import React from 'react'
import CheckboxGroup from '../components/CheckboxGroup'

const ProviderFilter = ({providers, checkboxState, setCheckboxState}) => {

  // if haven't initialized the state yet, set it now
  if (!checkboxState && providers && providers.length > 0) {
    // create item list - one for each connection
    const items = {};
    for (const p of providers) {
      // take first element of name in the format like google-oauth2
      const [providerTitle] = p.split('-');
      items[p] = { 
        name: `dashboardCB-${p}`,
        title: providerTitle,
        state: true
      }
    }
    setCheckboxState(items);
  }
  
  // event handler for checkbox group
  const onSelect = (event) => {
    // make a copy of state
    const items = { ...checkboxState };

    // checkbox name is in the form `dashboardCB-${name}`
    const name = event.target.name && event.target.name.split('dashboardCB-')[1];
    if (name && items[name]) {
      items[name].state = !items[name].state;
      setCheckboxState(items);
    }
  }

  return (
    checkboxState ? 
      <CheckboxGroup 
        state={checkboxState}
        onSelect={onSelect}
      /> 
      : <div/>
  )
}

export default ProviderFilter