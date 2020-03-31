import React from 'react'
import Highlight from '../Highlight'

const CodeTab = ({snap}) => 
  snap && snap.text ? <Highlight language='yaml'>{snap.text}</Highlight> : <div/>

export default CodeTab
