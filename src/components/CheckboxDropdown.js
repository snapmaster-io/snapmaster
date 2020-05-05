import React, { useState, useRef } from 'react'
import { Overlay, Button } from 'react-bootstrap'
import CheckboxGroup from './CheckboxGroup'

const CheckboxDropdown = ({
  state,
  onSelect,
  columns
}) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <div>
      <Button ref={target} onClick={() => setShow(!show)}>
        Filter by trigger &nbsp;&nbsp;
        <i className={`fa fa-chevron-${show?"up":"down"}`}/>
      </Button>
      <Overlay target={target.current} show={show} placement="bottom-start"> 
      {({
        scheduleUpdate,
        arrowProps,
        outOfBoundaries,
        show,
        ...props
      }) => (        
        <div {...props} style={{ 
          zIndex: 200,
          ...props.style
        }}>
        { 
          <CheckboxGroup 
            state={state}
            onSelect={onSelect}
            columns={columns}
          />
        }
        </div>
      )}
      </Overlay>
    </div>
  )
}

export default CheckboxDropdown