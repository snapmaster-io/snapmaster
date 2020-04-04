import React, { useState } from 'react'
import { useApi } from '../../utils/api'
import { Button, Card } from 'react-bootstrap'
import SnapParametersEditor from './SnapParametersEditor'

const ActiveSnapParameters = ({activeSnap}) => {
  const { post } = useApi();
  const [refresh, setRefresh] = useState(false);

  const activeSnapId = activeSnap && activeSnap.activeSnapId;

  const editSnap = async () => {
    // set the spinner
    setRefresh(true);

    // post a request to the activesnaps endpoint
    const request = {
      action: 'edit',
      snapId: activeSnapId,
      params: activeSnap.params
    };

    const [response, error] = await post('activesnaps', JSON.stringify(request));
    if (error || !response.ok) {
    }

    // turn off the spinner
    setRefresh(false);
  }

  return (
    <div>
      <h5 style={{ margin: 10 }}>{activeSnap && 'Parameters:'}</h5>
      <Card>
        <Card.Body>
          <SnapParametersEditor params={activeSnap && activeSnap.params} />
          <Button variant="primary" style={{ marginTop: 10 }} onClick={ editSnap }>
            <i className={`fa fa-${refresh ? 'spinner' : 'save'}`} />&nbsp;&nbsp;Change Values
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ActiveSnapParameters
