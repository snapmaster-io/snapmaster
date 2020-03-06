import React from 'react'

const ButtonRow = ({width, children}) => {
  return (
    <div style={{
      position: "fixed",
      display: "flex",
      background: "white",
      padding: "10px 10px 10px 10px",
      marginTop: "-1px",
      width: width,
      zIndex: 5
    }}>
    { 
      children.map((button, index) => {
        return (
          <div key={index} style={{ paddingRight: "10px"}}>
            { button }
          </div>
        )
      }) 
    }
    </div>
  )
}

export default ButtonRow