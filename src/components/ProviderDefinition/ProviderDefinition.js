import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import OperationsTab from './OperationsTab'

const ProviderDefinition = ({provider}) => {
  const [key, setKey] = useState('triggers');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="triggers" title={<span><i className="fa fa-flash" />&nbsp;&nbsp;Triggers</span>}>
        <OperationsTab operations={provider.definition.triggers} />
      </Tab>
      <Tab eventKey="actions" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Actions</span>}>
        <OperationsTab operations={provider.definition.actions} />
      </Tab>
    </Tabs>    
  )  
}

export default ProviderDefinition