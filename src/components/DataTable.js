import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './DataTable.css'

const DataTable = ({data, columns, keyField, selectRow, hiddenRows, rowEvents}) => {
  return (
    <BootstrapTable 
      className="dataTable" 
      bootstrap4
      keyField={ keyField } 
      data={ data }
      columns={ columns }
      striped hover condensed
      bordered={ false }
      noDataIndication="No data to display :)"
      selectRow={ selectRow }
      hiddenRows={ hiddenRows }
      rowEvents={ rowEvents }
      />
  )
}

export default DataTable