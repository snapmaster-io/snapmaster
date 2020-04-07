import React from 'react'

const ValueProp = ({text, image, background}) => {
  const color = background === 'white' ? 'black' : 'white';
  return (
    <div style={{ backgroundColor: background, paddingTop: 50, paddingBottom: 50 }}>
    { text &&  <h2 style={{ color: color, width: 'calc(75%)', paddingLeft: 'calc(25%)', marginBottom: 0 }}>{text}</h2> }
    { image && <img style={{ paddingTop: 30, maxWidth: 'calc(80%)', maxHeight: 'calc(75%)' }} src={`/${image}`} alt={image} /> }
    </div>
  )
}

export default ValueProp