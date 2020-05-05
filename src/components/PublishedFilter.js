import React from 'react'
import CheckboxGroup from '../components/CheckboxGroup'

const PublishedFilter = ({checkboxState, setCheckboxState, initialState = true}) => {
  // create an array of publised states
  const publishedStates = [
    { name: 'public', icon: 'fa fa-users' },
    { name: 'private', icon: 'fa fa-lock' },
  ];

  // if haven't initialized the state yet, set it now
  if (!checkboxState) {
    // create item list - one for each connection
    const items = {};
    for (const state of publishedStates) {
      items[state.name] = { 
        name: `publishedCB-${state.name}`,
        icon: state.icon,
        title: state.name,
        text: state.name,
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
    const name = event.target.name && event.target.name.split('publishedCB-')[1];
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
        columns={4}
      /> 
      : <div/>
  )
}

export default PublishedFilter