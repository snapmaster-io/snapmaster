import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import CodeTab from './CodeTab'
import ManageTab from './ManageTab'
import HistoryTab from './HistoryTab'

const ActiveSnapDetail = ({activeSnap, setActiveSnap}) => {
  const [key, setKey] = useState('manage');
  return (
    <Tabs activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey="manage" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Manage</span>}>
        <ManageTab snap={activeSnap && activeSnap.snap} activeSnap={activeSnap} setActiveSnap={setActiveSnap} />
      </Tab>
      <Tab eventKey="history" title={<span><i className="fa fa-bar-chart" />&nbsp;&nbsp;History</span>}>
        <HistoryTab activeSnap={activeSnap} />
      </Tab>
      <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
        <CodeTab snap={activeSnap && activeSnap.snap} />
      </Tab>
    </Tabs>
  )
}

export default ActiveSnapDetail