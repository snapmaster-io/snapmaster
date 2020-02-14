import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'

const HighlightCard = ({border, ...props}) => {
  const [borderColor, setBorderColor] = useState("gray");
  const mouseEnter = () => { setBorderColor("dark") }
  const mouseLeave = () => { setBorderColor("gray") }

  return (
    <Card 
      onMouseEnter={mouseEnter} 
      onMouseLeave={mouseLeave} 
      border={border ? border : borderColor}
      {...props}/>
  )
}

export default HighlightCard