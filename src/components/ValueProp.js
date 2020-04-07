import React from 'react'

const ValueProp = ({text, image, background}) => {
  const color = background === 'white' ? 'black' : 'white';
  return (
    <div style={{ backgroundColor: background, paddingTop: 50, paddingBottom: 50 }}>
    { text &&  <h1 style={{ color: color, width: 'calc(85%)', paddingLeft: 'calc(15%)', marginBottom: 0 }}>{text}</h1> }
    { image && <img style={{ paddingTop: 30, maxWidth: 'calc(80%)', maxHeight: 'calc(75%)' }} src={`/${image}`} alt={image} /> }
    </div>
  )
}

export default ValueProp