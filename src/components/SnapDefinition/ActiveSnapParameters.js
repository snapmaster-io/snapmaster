import React from 'react'
import { useApi } from '../../utils/api'
import { navigate } from 'hookrouter'
import { Button, Card, InputGroup, FormControl } from 'react-bootstrap'

const ActiveSnapParameters = ({activeSnap}) => {
  const { post } = useApi();

  const activeSnapId = activeSnap && activeSnap.activeSnapId;

  const editSnap = async () => {
    // post a request to the activesnaps endpoint
    const request = {
      action: 'edit',
      snapId: activeSnapId,
      params: activeSnap.params
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    navigate('/snaps/active');
  }

  return (
    <div>
      <h5 style={{ margin: 10 }}>{activeSnap && 'Parameters:'}</h5>
      <Card>
        <Card.Body>
          { activeSnap && activeSnap.params && activeSnap.params.map(p => 
            <InputGroup className="mb-3" key={p.name}>
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 120 }} id={p.name}>{p.name}</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="account"
                aria-describedby={p.name}
                placeholder={p.value} 
                onChange={(e) => { p.value = e.target.value } }
              />
            </InputGroup>
          )}
          <Button variant="primary" style={{ marginTop: 10 }} onClick={ editSnap }>
            <i className="fa fa-save"></i>&nbsp;&nbsp;Change Values
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ActiveSnapParameters
