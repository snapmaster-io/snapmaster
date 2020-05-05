import React from 'react'
import CheckboxDropdown from '../components/CheckboxDropdown'

const ProviderFilter = ({providers, checkboxState, setCheckboxState, initialState = true}) => {

  // if haven't initialized the state yet, set it now
  if (!checkboxState && providers && providers.length > 0) {
    // create item list - one for each connection
    const items = {};
    for (const p of providers) {
      items[p.title] = { 
        name: `dashboardCB-${p.title}`,
        title: p.title,
        icon: p.icon,
        state: initialState
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
      <CheckboxDropdown 
        state={checkboxState}
        onSelect={onSelect}
        columns={4}
      /> 
      : <div/>
  )
}

export default ProviderFilter