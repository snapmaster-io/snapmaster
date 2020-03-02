import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import PageTitle from '../components/PageTitle'
import RefreshButton from '../components/RefreshButton'
import Highlight from '../components/Highlight'
import ButtonRow from '../components/ButtonRow'
import { Button, Tabs, Tab } from 'react-bootstrap'
import { useConnections } from '../utils/connections'
import ProviderCard from '../components/ProviderCard'

const SnapPage = ({snapId}) => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const { connections } = useConnections();
  const [loading, setLoading] = useState();
  const [snap, setSnap] = useState();
  const [key, setKey] = useState('visual');

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get(`snaps/${snapId}`);

      if (error || !response.ok) {
        setLoading(false);
        setSnap(null);
        return;
      }
  
      const item = await response.json();
      setLoading(false);
      setSnap(item);
    }
    call();
  }, [get, snapId]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if there is no snap data to display, show a message instead
  if (!loading && !snap) {
    return (
      <div>
        <div className="page-header">
          <RefreshButton load={loadData} loading={loading}/>
          <h4 className="page-title">{snapId}</h4>
        </div>
        <div>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;Can't reach service - try refreshing later</span>
        </div>
      </div>
    )
  }

  const activate = async () => {
    // post a request to the activesnaps endpoint
    const request = {
      action: 'activate',
      snapId: snapId
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }
  }

  const fork = async () => {
    // post the fork request to the snaps endpoint
    const request = {
      action: 'fork',
      snapId: snapId
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }
  }

  const userId = snap && snap.userId; // snapId.split('/')[0];
  const snapName = snap && snap.name; // snapId.split('/')[1];
  // HACK: replace encoded character with pipe. this goes away when users can select account names
  const userName = userId; //userId.replace('%7C', '|'); 

  const providerName = snap && snap.trigger;
  const provider = providerName && connections && connections.find(el => el.provider === providerName);

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{snap && snap.snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          { userName !== user.sub && <Button onClick={ fork }><i className="fa fa-code-fork"></i>&nbsp;&nbsp;Fork</Button> }
        </div>
      </div>

      <Tabs activeKey={key} onSelect={k => setKey(k)}>
        <Tab eventKey="visual" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Visual</span>}>
          <div style={{ display: 'flex' }}>
            { provider && <ProviderCard provider={provider} /> }
            { provider && <i style={{ fontSize: '6em', margin: 50 }} className="fa fa-play text-muted" /> }
            { snap && snap.actions && snap.actions.map(a => { 
                const actionProvider = connections && connections.find(el => el.provider === a);
                return actionProvider && <ProviderCard key={a} provider={actionProvider} />
              })
            }
          </div>
        </Tab>
        <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
          { snap && <Highlight>{snap.text}</Highlight> }
        </Tab>
        <Tab eventKey="activate" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Activate</span>}>
          <Button onClick={ activate }><i className="fa fa-play"></i>&nbsp;&nbsp;Activate</Button>
        </Tab>
      </Tabs>
    </div>
  )
}

export default SnapPage