import React, { useState } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'

const ParamsEditor = ({params, setParams}) => {
  const [paramValues, setParamValues] = useState(params);
  const [counter, setCounter] = useState(0);

  // refresh param values if the were modified via the code editor
  if (paramValues !== params) {
    setParamValues(params);
  }

  // add empty string values to remove "uncontrolled to controlled" react errors
  if (paramValues) {
    let changed = false;
    for (const p of paramValues) {
      if (p.description === undefined) {
        p.description = '';
        changed = true;
      }
      if (p.entity === undefined) {
        p.entity = ''
        changed = true;
      }
    }

    // update the parameter value storage for the react data-bound controls
    if (changed) {
      setParamValues(paramValues);
    }
  }

  const addParam = () => {
    params.push({ name: `p-${counter}`});
    setCounter(counter + 1);
    setParamValues(params);
  }

  const deleteParam = (index) => {
    params.splice(index, 1);
    setParamValues(params);
    setParams(params);
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h5 style={{ marginTop: 5 }}>Parameters:</h5>
        <Button style={{ marginLeft: 50 }} onClick={addParam}>
          <i className="fa fa-plus" />&nbsp;&nbsp;Add&nbsp;
        </Button>
      </div>
      { paramValues && paramValues.map((p, index) => {
          const store = (field, val) => {
            p[field] = val; 
            setParamValues(paramValues);
            setParams(paramValues);
          }

          return (
            <InputGroup className="mb-3" key={index} style={{ marginTop: 20 }}>
              <InputGroup.Prepend>
                <Button variant="danger" onClick={() => { deleteParam(index) }}>
                  <i className="fa fa-times" />
                </Button>
              </InputGroup.Prepend>            
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 75 }}>Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="value"
                aria-describedby="Name"
                value={p.name} 
                onChange={(e) => { store("name", e.target.value) }} />
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 100 }}>Description</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="value"
                aria-describedby="Description"
                value={p.description} 
                onChange={(e) => { store("description", e.target.value) }} />
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 80 }}>Entity</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="value"
                aria-describedby="Entity"
                value={p.entity} 
                onChange={(e) => { store("entity", e.target.value) }} />
            </InputGroup>
          )        
        })
      }
    </div>
  )
}

export default ParamsEditor
