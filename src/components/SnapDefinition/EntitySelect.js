import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../../utils/api'
import Select from 'react-select'
import './EntitySelect.css'

const EntitySelect = ({parameter}) => {
  const { get } = useApi();
  const [options, setOptions] = useState([]);

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      const [response, error] = await get(`entities/${parameter.entity}`);
      if (error || !response.ok) {
        setOptions([]);
        return;
      }
  
      const items = await response.json();      
      const optionsData = items && items.map(e => { return { label: e.__id, value: e.__id } });
      setOptions(optionsData);
    }
    call();
  }, [get, parameter.entity]);

  // load entity data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const defaultOption = parameter.value ? [ { label: parameter.value, value: parameter.value} ] : options[0];

  return (
    <Select 
      className='paramSelect' options={options} defaultValue={defaultOption} onChange={ (e) => { parameter.value = e.value }}
    />
  )
}

export default EntitySelect