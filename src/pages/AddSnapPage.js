import React, { useState } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useProfile } from '../utils/profile'
import { Button } from 'react-bootstrap'
import SnapCodeEditor from '../components/SnapCodeEditor'
import YAML from 'yaml'

const AddSnapPage = () => {
  const { post } = useApi();
  const { profile } = useProfile();
  const [definition, setDefinition] = useState();
  const [name, setName] = useState();

  const save = async () => {
    // post the fork request to the snaps endpoint
    const request = {
      action: 'create',
      definition: definition
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    } 

    const item = response.json();
    if (item.status === 'success') {
      navigate('/snaps/mysnaps');
    } else {
      // TODO: error
    }
  }

  // get account and name
  const account = profile && profile.account;
  try {
    const snapName = definition && YAML.parse(definition).name;
    if (snapName) {
      setName(snapName);
    }
  } catch {
  }

  return (
    <div>
      <div className="page-header">
        <h4 className="page-title">
          { account && `${account}/` }
          { name || '[add name: property to name this snap]'}
        </h4>
        <div style={{ marginLeft: 50 }}>
          <Button disabled={!name} onClick={save}><i className="fa fa-save"></i>&nbsp;&nbsp;Save</Button>
        </div>
      </div>
      <SnapCodeEditor definition={definition} setDefinition={setDefinition}/>
    </div>
  )
}

export default AddSnapPage