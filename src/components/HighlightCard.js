import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'

const HighlightCard = ({border, ...props}) => {
  const [borderColor, setBorderColor] = useState(border ? border : "gray");
  const mouseEnter = () => { setBorderColor("dark") }
  const mouseLeave = () => { setBorderColor(border ? border : "gray"); ; }

  return (
    <Card 
      onMouseEnter={mouseEnter} 
      onMouseLeave={mouseLeave} 
      border={borderColor}
      {...props}/>
  )
}

export default HighlightCard