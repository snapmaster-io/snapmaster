import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { Button, Tabs, Tab, Card, Form, Row, Col } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import Highlight from '../components/Highlight'
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
      snapId: snapId,
      params: snap.parameters
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    navigate('/snaps/active');
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

    navigate('/snaps/mysnaps');
  }

  const userId = snap && snap.userId; 
  const providerName = snap && snap.provider;
  const provider = providerName && connections && connections.find(el => el.provider === providerName);

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return actionConfig.provider;
  });

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{snap && snap.snapId}</h4>
        <div style={{ marginLeft: 50 }}>
          { userId !== user.sub && <Button onClick={ fork }><i className="fa fa-code-fork"></i>&nbsp;&nbsp;Fork</Button> }
        </div>
      </div>

      <Tabs activeKey={key} onSelect={k => setKey(k)}>
        <Tab eventKey="visual" title={<span><i className="fa fa-sitemap" />&nbsp;&nbsp;Visual</span>}>
          <h5 style={{ margin: 10 }}>{snap && snap.description}</h5>
          <div style={{ display: 'flex' }}>
            { provider && <ProviderCard provider={provider} /> }
            { provider && <i style={{ fontSize: '6em', margin: 50 }} className="fa fa-play text-muted" /> }
            { actionList && actionList.map(a => { 
                const actionProvider = connections && connections.find(el => el.provider === a);
                return actionProvider && <ProviderCard key={a} provider={actionProvider} />
              })
            }
          </div>
          <h5 style={{ margin: 10 }}>{snap && 'Parameters:'}</h5>
          <div style={{ marginLeft: 20 }}>
            { snap && snap.parameters && 
              <Card>
                <Card.Body>
                { 
                  snap.parameters.map(p => 
                    <div key={p.name} style={{ display: 'flex'}}>
                      <h5 style={{ fontWeight: 400 }}>{p.name}: </h5>
                      <h5>&nbsp;&nbsp;{p.description}</h5>
                    </div>
                  )
                }
                </Card.Body>
              </Card>
            }
          </div>
        </Tab>
        <Tab eventKey="code" title={<span><i className="fa fa-code" />&nbsp;&nbsp;Code</span>}>
          { snap && snap.text && <Highlight>{snap.text}</Highlight> }
        </Tab>
        <Tab eventKey="activate" title={<span><i className="fa fa-play" />&nbsp;&nbsp;Activate</span>}>
          <Card style={{ minWidth: 'calc(100% - 220px)', maxWidth: 'calc(100% - 220px)'}}>
          { 
            snap && snap.parameters && snap.parameters.map(p => 
            <Form key={p.name}>
              <div>
                <Form.Group as={Row} style={{ margin: 20 }}>
                  <Form.Label style={{ fontWeight: 400 }} column sm="2">{p.name}: </Form.Label>
                  <Col sm="10">
                    <Form.Control placeholder={p.description} onChange={ (e) => { p.value = e.target.value }} />
                  </Col>
                </Form.Group>
              </div>
            </Form> 
            )
          }
          </Card> 
          <Button variant="primary" style={{ marginTop: 10 }} onClick={ activate }>
            <i className="fa fa-play"></i>&nbsp;&nbsp;Activate
          </Button>
        </Tab>
      </Tabs>
    </div>
  )
}

export default SnapPage