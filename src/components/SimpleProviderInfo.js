import React from 'react'
import { useConnections } from '../utils/connections'
import { InputGroup, FormControl } from 'react-bootstrap'

const SimpleProviderInfo = ({providerName}) => {
  const { connections } = useConnections();
  
  const provider = providerName && connections.find(c => c.provider === providerName);
  const connection = provider && provider.definition && provider.definition.connection;
  const infoUrl = connection.infoUrl;
  const infoText = connection.infoText;
  return (
    <div>
      <p>Enter information to connect to {providerName}:</p>
      { connection.connectionInfo && connection.connectionInfo.map(p =>
        <InputGroup className="mb-3" key={p.name}>
          <InputGroup.Prepend>
            <InputGroup.Text style={{ minWidth: 120 }} id={p.name}>{p.name}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="account"
            aria-describedby={p.name}
            placeholder={p.description} 
            onChange={(e) => { p.value = e.target.value } }
          />
        </InputGroup>          
      )}
      { infoUrl && infoText &&
        <p><a href={infoUrl} target='_'>{infoText}</a></p>
      }
    </div>
  )
}

export default SimpleProviderInfo