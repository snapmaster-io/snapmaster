import React from 'react'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'

const DisconnectButton = ({connection, redirectUrl}) => {
  const { loadConnections, connections } = useConnections();
  const { post } = useApi();

  // set up some variables
  const connected = connection.connected;
  const uid = `${connection.provider}|${connection.userId}`;
  
  // call the link / unlink user API
  const call = async (action, primaryUserId, secondaryUserId) => { 
    try {
      const body = JSON.stringify({ 
        action: action,
        primaryUserId: primaryUserId,
        secondaryUserId: secondaryUserId 
      });

      const [response, error] = await post('link', body);
      if (error || !response.ok) {
        return;
      }

      const responseData = await response.json();
      const success = responseData && responseData.message === 'success';
      if (success) {
        // refresh the page
        loadConnections();
        navigate(redirectUrl);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };  

  // add or remove a simple connection
  const processConnection = async (action, providerName) => {
    const provider = connections.find(c => c.provider === providerName);
    const entity = provider.definition.connection.entity;

    const body = JSON.stringify({ 
      action: action, 
      provider: providerName, 
      entityName: entity
    });

    const [response, error] = await post('connections', body);
    if (error || !response.ok) {
      return;
    }

    const responseData = await response.json();
    const success = responseData && responseData.message === 'success';
    if (success) {
      // refresh the page
      loadConnections();
      navigate(redirectUrl);
    }
  }
    
  return (
    <div>
      { 
        connected !== 'base' && connection.type === 'link' &&
          <Button variant='danger' onClick={ () => { call('unlink', null, uid) } }>Disconnect</Button>
      }
      { 
        connected !== 'base' && connection.type === 'simple' &&
          <Button variant='danger' onClick={ () => { processConnection('remove', connection.provider) } }>Disconnect</Button>
      }
      { 
        connected !== 'base' && connection.type === 'oauth' &&
          <Button variant='danger' onClick={ () => { processConnection('removeoauth', connection.provider) } }>Disconnect</Button>
      }
    </div>
  )  
}

export default DisconnectButton