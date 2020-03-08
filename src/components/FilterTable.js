import React, { useState } from 'react'
import { useApi } from '../utils/api'
import DataTable from '../components/DataTable'
import ButtonRow from '../components/ButtonRow'
import Button from 'react-bootstrap/Button'

const FilterTable = ({
  data,      // raw data array returned from API
  setData,   // setstate method for data
  dataRows,  // processed data rows 
  columns,   // columns
  keyField,  // key field for both data and dataRows
  path,      // API path to call back to update __active field
  maxHeight, // control height 
  children   // additional buttons
}) => {
  const { post } = useApi();
  const [hiddenRowKeys, setHiddenRowKeys] = useState();
  const [showAll, setShowAll] = useState(false);

  // build up the list of active records
  let active = data.filter(r => r.__active).map(r => r[keyField]);

  // if the hidden row keys array doesn't yet exist, initialize it
  if (active.length > 0 && !hiddenRowKeys) {
    setHiddenRowKeys(active);
  }  

  const selectRow = { 
    mode: 'checkbox', 
    clickToSelect: true,
    selected: active,
    onSelect: (row, isSelect) => {
      if (isSelect) {
        active.push(row[keyField]);
      } else {
        active = active.filter(x => x !== row[keyField]);
      }
    },
    onSelectAll: (isSelect, rows) => {
      const ids = rows.map(r => r[keyField]);
      if (isSelect) {
        active = ids;
      } else {
        active = [];
      }
    }
  };
  
  const markActive = async () => {
    const metadata = data.map(r => {
      const id = r[keyField];
      const isActive = active.find(h => h === id) ? true : false;

      // adjust the local state of the current row
      r.__active = isActive;
      // return an entry with the __id and the __active flag
      return { __id: id, __active: isActive }
    });

    // hide the rows that have been marked read 
    // do this before posting the operation to the API in order to 
    // update the display without waiting for the network operation
    setHiddenRowKeys(active);
    setShowAll(false);
        
    // post the metadata to the API path
    const [response, error] = await post(path, JSON.stringify(metadata));
    if (error || !response.ok) {
      return;
    }

    // retrieve the new dataset, which will trigger a repaint
    const items = await response.json();
    setData(items);
  }

  const toggleShow = () => {
    // if already showing all records, flip the state, don't show active
    if (showAll) {
      setHiddenRowKeys(active);
      setShowAll(false);
    } else {
      setHiddenRowKeys([]);
      setShowAll(true);
    }
  }

  return (
    dataRows && dataRows.length > 0 ? 
      <div>
        <ButtonRow>
          <Button onClick={ markActive }>Enable Checked Repos</Button>
          <Button onClick={ toggleShow }>{ showAll ? "Hide Active Repos" : "Show All" }</Button>
          { children }
        </ButtonRow>
        <div style={{
          position: "relative",
          top: 60,
          overflow: "auto",
          maxHeight: maxHeight
        }}>
          <DataTable 
            columns={columns} 
            data={dataRows} 
            keyField={keyField} 
            selectRow={selectRow}
            hiddenRows={hiddenRowKeys} /> 
        </div>
      </div> :
      <span>No data to display :)</span>
  )
}

export default FilterTable