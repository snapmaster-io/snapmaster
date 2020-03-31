import React from 'react'
import { useApi } from '../../utils/api'
import { navigate } from 'hookrouter'
import { useConnections } from '../../utils/connections'
import { Button, InputGroup, FormControl } from 'react-bootstrap'

const ActivateTab = ({snap}) => {
  const { post } = useApi();
  const { connections } = useConnections();

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

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c.name === action);
    return actionConfig.provider;
  });

  const actionProviders = actionList && actionList.map(a => { 
    const actionProvider = connections && connections.find(el => el.provider === a);
    return actionProvider;
  });

  // if one of the providers ins't connected, the activate tab should be disabled
  const disableActivateFlag = actionProviders && actionProviders.filter(p => !p.connected).length > 0;

  return (
    disableActivateFlag ? 
      <h5>Before activating a snap, please connect all the tools it references</h5> :
      <div>
        { snap && snap.parameters && snap.parameters.map(p => 
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
        <Button variant="primary" style={{ marginTop: 10 }} onClick={ activate }>
          <i className="fa fa-play"></i>&nbsp;&nbsp;Activate
        </Button>
      </div>
  )
}

export default ActivateTab
