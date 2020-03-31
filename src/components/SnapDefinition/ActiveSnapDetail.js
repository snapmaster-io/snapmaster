import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import CodeTab from './CodeTab'
import ManageTab from './ManageTab'
import VisualTab from './VisualTab'

const ActiveSnapDetail = ({snap, activeSnap, setActiveSnap}) => {
  const [key, setKey] = useState('manage');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="manage" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Manage</span>}>
        <ManageTab snap={snap} activeSnap={activeSnap} setActiveSnap={setActiveSnap} />
      </Tab>
      <Tab eventKey="history" title={<span><i className="fa fa-bar-chart" />&nbsp;&nbsp;History</span>}>
        <VisualTab snap={snap} />
      </Tab>
      <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
        <CodeTab snap={snap} />
      </Tab>
    </Tabs>
  )
}

export default ActiveSnapDetail