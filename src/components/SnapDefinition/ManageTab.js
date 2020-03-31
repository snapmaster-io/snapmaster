import React from 'react'
import SnapDescription from './SnapDescription'
import TriggerActionCards from './TriggerActionsCards'
import ActiveSnapParameters from './ActiveSnapParameters'
import ActiveSnapActions from './ActiveSnapActions'

const ManageTab = ({snap, activeSnap, setActiveSnap}) => 
  <div>
    <SnapDescription snap={snap} />
    { activeSnap && <TriggerActionCards snap={snap} state={activeSnap.state}/> }
    { activeSnap && <ActiveSnapActions activeSnap={activeSnap} setActiveSnap={setActiveSnap} /> }
    { activeSnap && <ActiveSnapParameters activeSnap={activeSnap} /> }
  </div>

export default ManageTab