import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import OperationsTab from '../ProviderDefinition/OperationsTab'
import CodeTab from '../SnapDefinition/CodeTab'
import ExecuteActionTab from './ExecuteActionTab'

const ActionDefinition = ({action}) => {
  const [key, setKey] = useState('actions');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="actions" title={<span><i className="fa fa-exclamation" />&nbsp;&nbsp;Actions</span>}>
        <OperationsTab operations={action && action.actions} />
      </Tab>
      <Tab eventKey="definition" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Definition</span>}>
        <CodeTab snap={action} />
      </Tab>
      <Tab eventKey="execute" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Execute</span>}>
        <ExecuteActionTab action={action} />
      </Tab>
    </Tabs>    
  )  
}

export default ActionDefinition