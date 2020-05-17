import React from 'react'
import SnapDescription from './SnapDescription'
import TriggerActionCards from './TriggerActionsCards'
import SnapParametersDisplay from './SnapParametersDisplay'

const VisualTab = ({snap}) =>
  <div>
    <SnapDescription snap={snap} />
    <TriggerActionCards snap={snap} />
    { snap && snap.parameters && <SnapParametersDisplay snap={snap} /> }
  </div>

export default VisualTab