import React from 'react'

const SnapDescription = ({snap}) =>
  <h5 style={{ margin: 10 }}>
    {snap && snap.private ? <span><i className="fa fa-lock" />&nbsp;&nbsp;</span>
                          : <span><i className="fa fa-users" />&nbsp;&nbsp;</span>}
    {snap && snap.description}
  </h5>

export default SnapDescription