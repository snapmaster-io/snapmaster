import React from 'react'

const SnapDescription = ({snap}) =>
  <h5 style={{ margin: 10 }}>{snap && snap.description}</h5>

export default SnapDescription