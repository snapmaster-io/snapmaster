import React, { useState } from 'react'
import { useApi } from '../utils/api'
import DataTable from '../components/DataTable'
import ButtonRow from '../components/ButtonRow'
import Button from 'react-bootstrap/Button'

const FilterTable = ({
  data,     // raw data array returned from API
  setData,  // setstate method for data
  dataRows, // processed data rows 
  columns,  // columns
  keyField, // key field for both data and dataRows
  path,     // API path to call back to update __handled field
  maxHeight // control height 
}) => {
  const { post } = useApi();
  const [hiddenRowKeys, setHiddenRowKeys] = useState();
  const [showAll, setShowAll] = useState(false);

  // build up the list of handled records
  let handled = data.filter(r => r.__handled).map(r => r[keyField]);

  // if the hidden row keys array doesn't yet exist, initialize it
  if (handled.length > 0 && !hiddenRowKeys) {
    setHiddenRowKeys(handled);
  }  

  const selectRow = { 
    mode: 'checkbox', 
    clickToSelect: true,
    selected: handled,
    onSelect: (row, isSelect) => {
      if (isSelect) {
        handled.push(row[keyField]);
      } else {
        handled = handled.filter(x => x !== row[keyField]);
      }
    },
    onSelectAll: (isSelect, rows) => {
      const ids = rows.map(r => r[keyField]);
      if (isSelect) {
        handled = ids;
      } else {
        handled = [];
      }
    }
  };
  
  const markRead = async () => {
    const metadata = data.map(r => {
      const id = r[keyField];
      const isHandled = handled.find(h => h === id) ? true : false;

      // adjust the local state of the current row
      r.__handled = isHandled;
      // return an entry with the __id and the __handled flag
      return { __id: id, __handled: isHandled }
    });

    // hide the rows that have been marked read 
    // do this before posting the operation to the API in order to 
    // update the display without waiting for the network operation
    setHiddenRowKeys(handled);
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
    // if already showing all records, flip the state, don't show handled
    if (showAll) {
      setHiddenRowKeys(handled);
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
          <Button onClick={ markRead }>Mark Checked as Handled</Button>
          <Button onClick={ toggleShow }>{ showAll ? "Hide Handled" : "Show All" }</Button>
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