import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import OperationsTab from './OperationsTab'
import CredentialsTab from './CredentialsTab'

const ProviderDetails = ({provider, data, setData, loading}) => {
  const [key, setKey] = useState('credentials');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="credentials" title={<span><i className="fa fa-user" />&nbsp;&nbsp;Credentials</span>}>
        <CredentialsTab provider={provider} data={data} setData={setData} loading={loading} />
      </Tab>
      <Tab eventKey="triggers" title={<span><i className="fa fa-flash" />&nbsp;&nbsp;Triggers</span>}>
        <OperationsTab operations={provider.definition.triggers} />
      </Tab>
      <Tab eventKey="actions" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Actions</span>}>
        <OperationsTab operations={provider.definition.actions} />
      </Tab>
    </Tabs>    
  )  
}

export default ProviderDetails