import React, { useState } from 'react'
import { useConnections } from '../../utils/connections'
import Select from 'react-select'
import './ProviderSelect.css'

const ActionSelect = ({config, setConfig, role, opname, newFlag}) => {
  const { connections } = useConnections();
  const [value, setValue] = useState();

  const provider = config && connections.find(c => c.provider === config.provider);
  const options = config && provider.definition[role]
    .map(e => { return { label: e.name, value: e.name } });

  // if no action, set it to the first option
  if (config && !config[opname]) {
    config[opname] = options[0].label;
    // if this is a new config section, set the name
    if (newFlag) {
      config.name = `${config.provider}-${config[opname]}`;
    }
    setConfig({ ...config });
  }

  // if value isn't set yet, or if it's set to the wrong value, update it now
  if (config && (!value || value.label !== config[opname])) {
    setValue({ label: config[opname], value: config[opname] });
  } 
  
  const onChange = (e) => { 
    config[opname] = e.value;
    // if this is a new config section, set the name
    if (newFlag) {
      config.name = `${config.provider}-${config[opname]}`;
    }
    setConfig({ ...config });
    setValue(e);
  }

  return (
    <Select 
      className='actionSelect' 
      options={options} 
      value={value} 
      onChange={onChange}
    />
  )
}

export default ActionSelect