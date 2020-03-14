import React, { useState } from 'react'
import { useApi } from '../utils/api'
import { navigate } from 'hookrouter'
import { useConnections } from '../utils/connections'
import { Button, Tabs, Tab, Card, Form, Row, Col } from 'react-bootstrap'
import Highlight from '../components/Highlight'
import ProviderCard from '../components/ProviderCard'

const SnapDefinition = ({snap, activeSnap, activeSnapId}) => {
  const { post } = useApi();
  const { connections } = useConnections();
  const [key, setKey] = useState('visual');

  const snapId = snap && snap.snapId;

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

  const providerName = snap && snap.provider;
  const provider = providerName && connections && connections.find(el => el.provider === providerName);

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return actionConfig.provider;
  });

  return (
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
              activeSnapId ? 
                activeSnap && activeSnap.params.map(p => 
                  <div key={p.name} style={{ display: 'flex'}}>
                    <h5 style={{ fontWeight: 400 }}>{p.name}: </h5>
                    <h5>&nbsp;&nbsp;{p.value}</h5>
                  </div>
                ) :
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
      { snap && snap.text && <Highlight language='yaml'>{snap.text}</Highlight> }
    </Tab>

    { !activeSnapId && /* "Activate" tab not available for already active snaps */
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
    }
  </Tabs>
  )
}

export default SnapDefinition