import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { Button, Tabs, Tab } from 'react-bootstrap'
import DataTable from './DataTable'

const TriggerActionConfig = ({
  entity, 
  setData,
  path,
  metadata
}) => {
  const { post } = useApi();
  const [key, setKey] = useState('triggers');
  const [selectedTriggers, setSelectedTriggers] = useState();
  const [selectedActions, setSelectedActions] = useState();

  const arrayEquals = (array1, array2) => 
    array1 && array2 && array1.length === array2.length && array1.every((value, index) => { return value === array2[index]})
  
  const triggers = (entity.triggers && entity.triggers.filter(r => r.enabled).map(r => r.name)) || [];
  if (!arrayEquals(selectedTriggers, triggers)) {
    setSelectedTriggers(triggers);
  }

  const actions = (entity.actions && entity.actions.filter(r => r.enabled).map(r => r.name)) || [];
  if (!arrayEquals(selectedActions, actions)) {
    setSelectedActions(actions);
  }

  const storeMetadata = async () => {
    const data = { __id: entity.id, __actions: entity.actions, __triggers: entity.triggers };
    console.log(entity);
    let payload;
    if (metadata) {
      // the caller wants to use the metadata endpoint to handle the payload - this means an array of inputs
      payload = [data]
    } else {
      // the caller wants to send a single entity with an 'edit' action
      payload = { ...data, action: 'edit' };
    }

    const [response, error] = await post(path, JSON.stringify(payload));
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
  }, {
    dataField: 'description',
    text: 'Description',
    sort: false,
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
        <Tab eventKey="triggers" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Triggers</span>}>
          <DataTable 
            columns={columns} 
            data={entity.triggers || []} 
            keyField='name'
            selectRow={selectRow(selectedTriggers, setSelectedTriggers)}
            />
        </Tab>
        <Tab eventKey="actions" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Actions</span>}>
          <DataTable 
            columns={columns} 
            data={entity.actions || []} 
            keyField='name'
            selectRow={selectRow(selectedActions, setSelectedActions)}
            />
        </Tab>
      </Tabs>
      <br />
      <br />
      <Button onClick={storeMetadata}>
        <i className="fa fa-save"></i>&nbsp;&nbsp;Save
      </Button>
    </div>
  )
}

export default TriggerActionConfig