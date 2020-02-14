import React from 'react'
import Button from 'react-bootstrap/Button'

const RefreshButton = ({load, loading}) => 
  <Button style={{ maxWidth: 40 }} onClick={load}>
    <i className={ loading ? "fa fa-spinner" : "fa fa-refresh" }></i>
  </Button>

export default RefreshButton