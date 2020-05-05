import React from 'react'
import { Form, Card } from 'react-bootstrap'

const CheckboxGroup = ({
  state,
  onSelect,
  columns
}) => {
  const total = state && Object.keys(state).length;

  // calculate width of control
  const checkboxGroupWidth = `${6 * columns}rem`;

  // transform state object into an array
  const stateArray = state && Object.keys(state).map(key => state[key]);

  // create an array of arrays of controls
  const checkboxRows = [];
  let checkboxRow;
  for (let i = 0; i < total; i++) {
    // check for a new row
    if (i % columns === 0) {
      // create a new row
      checkboxRow = [];
      checkboxRows.push(checkboxRow);
    }
    checkboxRow.push(stateArray[i]);
  }

  // bottom margin between checkbox rows - only set for more than one row
  const marginBottom = checkboxRows.length ? 10 : 0;

  return (
    <div style={{ maxWidth: checkboxGroupWidth }}>
      <Card>
        <Card.Body style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 9, paddingBottom: 0 }}>
          <div>
          {
            state && checkboxRows.map((row, i) => 
              <div key={i} style={{ display: 'flex', marginBottom: marginBottom }}>
              { /* horizontal layout */
                row.map(item => {
                  const label = <i className={`${item.icon} text-muted`} style={{ fontSize: '1.2em' }} />
                  const text = <span style={{ fontWeight: 300 }}>&nbsp;&nbsp;{item.text}</span> || "";
                  return (
                    <Card.Subtitle key={item.title}>
                      <Form.Check label={<span style={{ marginRight: 20 }}>&nbsp;{label}&nbsp;{text}</span>}
                        type="checkbox"
                        key={item.title}
                        name={item.name}
                        checked={item.state}
                        onChange={onSelect}
                        style={{ fontSize: '1.2em' }}
                      />
                    </Card.Subtitle>
                  )})
                  }
              </div>
            )
          }
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CheckboxGroup