import React, { useState, useContext } from 'react'
import { useApi } from './api'

export const ConnectionsContext = React.createContext();
export const useConnections = () => useContext(ConnectionsContext);
export const ConnectionsProvider = ({
  children
}) => {
  const { get } = useApi();
  const [connections, setConnections] = useState();
  const [loading, setLoading] = useState();

  const loadConnections = async () => {
    try {
      setLoading(true);
      const [response, error] = await get('connections');

      if (error || !response.ok) {
        setConnections(null);
        console.error(`loadConnections error: ${error}`);
      } else {
        const item = await response.json();
        if (!item || item.error) {
          setConnections(null);
          console.error(`loadConnections error: ${item.message}`);
        }
        setConnections(item.data);
      }  

      setLoading(false);
    } catch (error) {
      console.error(`loadConnections exception caught: ${error}`);
      setConnections(null);
    }  
  };

  return (
    <ConnectionsContext.Provider
      value={{
        loading,
        connections,
        loadConnections,
      }}>
      {children}
    </ConnectionsContext.Provider>
  );
};