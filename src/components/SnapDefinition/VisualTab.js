import React from 'react'
import SnapDescription from './SnapDescription'
import TriggerActionCards from './TriggerActionsCards'
import SnapParameters from './SnapParameters'

const VisualTab = ({snap}) =>
  <div>
    <SnapDescription snap={snap} />
    <TriggerActionCards snap={snap} />
    <SnapParameters snap={snap} />
  </div>

export default VisualTab