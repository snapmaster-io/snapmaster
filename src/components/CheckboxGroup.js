import React from 'react'
//import { MDBInput } from 'mdbreact'
//import 'mdbreact/dist/css/mdb.css'
import { Form, Card } from 'react-bootstrap'

const CheckboxGroup = ({
  state,
  onSelect
}) => {
  // get number of checkboxes to calculate width
  const numberOfCheckboxes = state && Object.keys(state).length;
  const checkboxGroupWidth = `${6 * numberOfCheckboxes}rem`;
  return (
    <div style={{ maxWidth: checkboxGroupWidth }}>
    { /* <MDBInput label="Filled unchecked" filled type="checkbox" id="checkbox1" /> */ }
      <Card>
        <Card.Body style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 12, paddingBottom: 6 }}>
          <div style={{ display: 'flex' }}>
          {  /* horizontal layout */
            state && Object.keys(state).map(item => {
              const label = <i className={`fa fa-fw fa-${state[item].title} text-muted`} style={{ fontSize: '1.2em' }} />
              return (
                <Card.Subtitle key={item}>
                  <Form.Check label={<span style={{ marginRight: 20 }}>&nbsp;{label}</span>}
                    type="checkbox"
                    key={item}
                    name={state[item].name}
                    checked={state[item].state}
                    onChange={onSelect}
                    style={{ fontSize: '1.2em' }}
                  />
                </Card.Subtitle>
              )})
          }
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CheckboxGroup