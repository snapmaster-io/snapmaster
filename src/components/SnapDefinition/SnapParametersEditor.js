import React from 'react'
import { Card, InputGroup, FormControl } from 'react-bootstrap'
import EntitySelect from './EntitySelect'

const SnapParametersEditor = ({params}) =>
  <div>
    { params && params.map(p =>
      <InputGroup className="mb-3" key={p.name}>
        <InputGroup.Prepend>
          <InputGroup.Text style={{ minWidth: 120 }} id={p.name}>{p.name}</InputGroup.Text>
        </InputGroup.Prepend>
        { p.entity ? 
          <EntitySelect parameter={p} 
          /> :
          <FormControl
            aria-label="value"
            aria-describedby={p.name}
            placeholder={p.value || p.description} 
            onChange={(e) => { p.value = e.target.value } }
          />
        }
      </InputGroup>
    )}
  </div>

export default SnapParametersEditor
