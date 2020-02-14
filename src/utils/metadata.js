import { useState, useCallback } from 'react'
import { useApi } from './api'

export function useMetadata() {
  const { get } = useApi();
  const [loading, setLoading] = useState(false);

  // define loadMetadata as a callback so that it's not regenerated with every invocation
  const loadMetadata = useCallback(() => {
    async function call() {
      try {
        setLoading(true);
        const [response, error] = await get('metadata');

        if (error || !response.ok) {
          setLoading(false);
          return null;
        } else {
          const responseData = await response.json();
          setLoading(false);
          return responseData;
        }
      } catch (error) {
        console.error(`loadMetadata exception caught: ${error}`);
        setLoading(false);
        return null;
      }
    }
    return call();
  }, [get]);

  return {
    loading,
    loadMetadata
  }
}
