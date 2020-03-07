import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { Button, Tabs, Tab } from 'react-bootstrap'
import DataTable from './DataTable'
import Highlight from './Highlight'

const TriggerActionConfig = ({
  entity, 
  setData,
  path,
}) => {
  const { post } = useApi();
  const [key, setKey] = useState('__triggers');
  const [selectedTriggers, setSelectedTriggers] = useState();
  const [selectedActions, setSelectedActions] = useState();

  const arrayEquals = (array1, array2) => 
    array1 && array2 && array1.length === array2.length && array1.every((value, index) => { return value === array2[index]})
  

  const triggers = entity.__triggers.filter(r => r.enabled).map(r => r.name);
  if (!arrayEquals(selectedTriggers, triggers)) {
    setSelectedTriggers(triggers);
  }

  const actions = entity.__actions.filter(r => r.enabled).map(r => r.name);
  if (!arrayEquals(selectedActions, actions)) {
    setSelectedActions(actions);
  }

  const storeMetadata = async () => {
    const data = { __id: entity.__id, __actions: entity.__actions, __triggers: entity.__triggers };
    const [response, error] = await post(path, JSON.stringify([data]));
    if (error || !response.ok) {
      return;
    }

    // refresh the data
    const items = await response.json();
    if (items && items.map) {
      setData(items);
    }
  }

  const columns = [{
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '220px' };
    }
  }];

  const selectRow = (selected, setSelected) => { 
    return {
      mode: 'checkbox', 
      clickToSelect: true,
      selected: selected,
      onSelect: (row, isSelect) => {
        if (isSelect) {
          row.enabled = true;
          selected.push(row.name);
        } else {
          row.enabled = false;
          setSelected(selected.filter(x => x !== row.name))
        }
      },
      onSelectAll: (isSelect, rows) => {
        const ids = rows.map(r => r.name);
        if (isSelect) {
          for (const r of rows) {
            r.enabled = true;
          }
          setSelected(ids);
        } else {
          for (const r of rows) {
            r.enabled = false;
          }
          setSelected([]);
        }
      }
    }
  };

  return (
    <div>
      <Tabs activeKey={key} onSelect={k => setKey(k)}>
        <Tab eventKey="__triggers" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Triggers</span>}>
          <DataTable 
            columns={columns} 
            data={entity.__triggers} 
            keyField='name'
            selectRow={selectRow(selectedTriggers, setSelectedTriggers)}
            />
        </Tab>
        <Tab eventKey="__actions" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Actions</span>}>
          <DataTable 
            columns={columns} 
            data={entity.__actions} 
            keyField='name'
            selectRow={selectRow(selectedActions, setSelectedActions)}
            />
        </Tab>
      </Tabs>
      <br />
      <br />
      <Button onClick={ storeMetadata }>
        Save
      </Button>
    </div>
  )
}

export default TriggerActionConfig