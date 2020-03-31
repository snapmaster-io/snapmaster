import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import ActivateTab from './ActivateTab'
import CodeTab from './CodeTab'
import VisualTab from './VisualTab'

const SnapDefinition = ({snap}) => {
  const [key, setKey] = useState('visual');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="visual" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Visual</span>}>
        <VisualTab snap={snap} />
      </Tab>
      <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
        <CodeTab snap={snap} />
      </Tab>
      <Tab eventKey="activate" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Activate</span>}>
        <ActivateTab snap={snap} />
      </Tab>
    </Tabs>
  )
}

export default SnapDefinition