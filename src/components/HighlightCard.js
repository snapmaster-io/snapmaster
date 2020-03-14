import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'

const HighlightCard = ({border, style, ...props}) => {
  const [borderColor, setBorderColor] = useState(border ? border : "gray");
  const [background, setBackground] = useState("white");
  const mouseEnter = () => { setBorderColor("dark"); setBackground("gainsboro"); }
  const mouseLeave = () => { setBorderColor(border ? border : "gray"); setBackground("white"); }
  const compositeStyle = { ...style, background: background };

  return (
    <Card 
      onMouseEnter={mouseEnter} 
      onMouseLeave={mouseLeave} 
      border={borderColor}
      style={compositeStyle}
      {...props}/>
  )
}

export default HighlightCard