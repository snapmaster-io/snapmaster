import React, { useState } from 'react'
import { useConnections } from '../../utils/connections'
import { InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap'
import ProviderSelect from './ProviderSelect'
import ActionSelect from './ActionSelect'
import ProviderDisplayCard from './ProviderDisplayCard'

const ProviderEditor = ({config, setConfig, role, opname, setOKState}) => {
  const { connections } = useConnections();
  const provider = config && connections.find(c => c.provider === config.provider);
  const definition = provider && provider.definition[role].find(e => e.name === config[opname]);
  const params = definition && definition.parameters;
  const [configValue, setConfigValue] = useState(config || {});
  const newFlag = !config || !config.name;

  // validate that all required parameters are present
  const checkOKButtonState = () => {
    if (!configValue.provider || !configValue[opname]) {
      return true;
    }
    // check that all required params are provided
    if (params) {
      for (const p of params) {
        if (p.required && !configValue[p.name]) {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <div style={{ display: 'flex' }}>
      <ProviderDisplayCard config={config} opname={opname} />
      <div style={{ minWidth: 'calc(90vw - 220px)', margin: 10 }}>
        <h5>Select tool and {opname}:</h5>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text style={{ minWidth: 150 }} id="toolName">tool</InputGroup.Text>
          </InputGroup.Prepend>
          <ProviderSelect 
            config={config} 
            setConfig={setConfig} 
            role={role} 
            opname={opname} />
        </InputGroup>
        <InputGroup className="mb-3" style={{ marginTop: 20 }}>
          <InputGroup.Prepend>
            <InputGroup.Text style={{ minWidth: 150 }} id="toolAction">{opname}</InputGroup.Text>
          </InputGroup.Prepend>
          <ActionSelect 
            config={config} 
            setConfig={setConfig} 
            role={role} 
            opname={opname}
            newFlag={newFlag} />
        </InputGroup>
        { params && <hr /> }
        { params && <h5>Provide parameter values (* required):</h5> }
        { params && params.map(p => {
            const entity = p.entity && p.entity.split(':')[1];
            const entityName = entity && entity.slice(0, entity.length - 1);
            const setValue = (val) => {
              configValue[p.name] = val; 
              config[p.name] = val; 
              setConfigValue({...config});

              // check and set the ok button state
              setOKState(checkOKButtonState());
            }
            // remove "uncontrolled to controlled" react errors
            if (!configValue[p.name]) {
              configValue[p.name] = "";
            }
            return (
              <InputGroup className="mb-3" key={p.name} style={{ marginTop: 20 }}>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ minWidth: 150 }}>{p.required ? `${p.name} *` : p.name}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-label="value"
                  aria-describedby={p.name}
                  value={configValue[p.name]} 
                  onChange={(e) => { setValue(e.target.value) }} />
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Options"
                  id="input-group-dropdown-2">
                  { p.entity && <Dropdown.Item onClick={() => setValue(`${p.entity}:default`)}>Default {entityName}</Dropdown.Item> }
                  <Dropdown.Item onClick={() => setValue(`$${p.name}`)}>New input parameter</Dropdown.Item>
                </DropdownButton> 
              </InputGroup>
            )        
          })
        }
      </div>
    </div>
  )
}

export default ProviderEditor