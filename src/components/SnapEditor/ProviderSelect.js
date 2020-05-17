import React from 'react'
import { useConnections } from '../../utils/connections'
import Select from 'react-select'
import './ProviderSelect.css'

const ProviderSelect = ({config, setConfig, role, opname}) => {
  const { connections } = useConnections();

  const options = connections && connections
    .filter(c => c.definition[role] && c.definition[role].length)
    .map(e => { return { label: e.title, value: e.title } });
  
  const defaultOption = config && config.provider ? { label: config.provider, value: config.provider } : options[0];

  const onChange = (e) => { 
    config = config || {};
    config.provider = e.value;
    delete config[opname];
    setConfig({ ...config });
  }

  return (
    <Select 
      className='providerSelect' 
      options={options} 
      defaultValue={defaultOption} 
      onChange={onChange}
    />
  )
}

export default ProviderSelect