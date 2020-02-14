import React from 'react'
import RefreshButton from '../components/RefreshButton'
import { Form, Col, Row, Card, Button } from 'react-bootstrap'
import { useProfile } from '../utils/profile'
import { navigate } from 'hookrouter'

const NotificationsPage = () => {
  const { profile, loadProfile, storeProfile, loading } = useProfile();
  const notifyEmail = profile && profile.notifyEmail;
  const notifySms = profile && profile.notifySms;
  const notifySettings = {
    'allFeedback': 'All feedback',
    'negativeFeedback': 'Negative feedback'
  };
  const notifyEmailSetting = notifyEmail && notifySettings[notifyEmail] ? notifySettings[notifyEmail] : 'None';
  const notifySmsSetting = notifySms && notifySettings[notifySms] ? notifySettings[notifySms] : 'None';

  const notificationSetting = (text) => {
    switch (text) {
      case 'All feedback':
        return 'allFeedback';
      case 'Negative feedback': 
        return 'negativeFeedback';
      case 'None':
        return 'none';
      default:
        return 'none';
    }
  }

  return(
    <div style={{
      marginLeft: 20,
      padding: '1px 0 0 20px',
      textAlign: 'left',
      width: 'calc(100vw - 60px)'
    }}>
      <div className="page-header">
        <RefreshButton load={loadProfile} loading={loading}/>
        <h4 className="page-title">Notifications</h4>
      </div>
      { 
        profile && 
        <div>
          <div style={{display: 'flex'}}>
            <Card border="secondary" style={{ minWidth: 'calc(50vw - 50px)', maxWidth: 'calc(50vw - 50px)'}}>
              <Form>
                <Form.Group as={Row} style={{ margin: 20 }}>
                  <Form.Label column sm="4">Email notifications: </Form.Label>
                  <Col sm="8">
                    <Form.Control 
                      as="select"
                      defaultValue={notifyEmailSetting} 
                      onChange={ (e) => { profile.notifyEmail = notificationSetting(e.target.value) }}>
                      <option>None</option>
                      <option>Negative feedback</option>
                      <option>All feedback</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} style={{ margin: 20 }}>
                  <Form.Label column sm="8">Email: {profile.email}</Form.Label>
                  <Col sm="4">
                    <Button style={{ float: 'right' }} variant="primary" onClick={ () => navigate('/profile') }>
                      &nbsp;Update email&nbsp;
                    </Button>
                  </Col>
                </Form.Group>
              </Form> 
            </Card> 

            <Card border="secondary" style={{ minWidth: 'calc(50vw - 50px)', maxWidth: 'calc(50vw - 50px)', marginLeft: 20 }}>
              <Form>
                <Form.Group as={Row} style={{ margin: 20 }}>
                  <Form.Label column sm="4">SMS notifications: </Form.Label>
                  <Col sm="8">
                    <Form.Control 
                      as="select"
                      defaultValue={notifySmsSetting} 
                      onChange={ (e) => { profile.notifySms = notificationSetting(e.target.value) }}>
                      <option>None</option>
                      <option>Negative feedback</option>
                      <option>All feedback</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} style={{ margin: 20 }}>
                  <Form.Label column sm="8">Phone: {profile.phone}</Form.Label>
                  <Col sm="4">
                    <Button style={{ float: 'right' }} variant="primary" onClick={ () => navigate('/profile') }>
                      &nbsp;Update phone&nbsp;
                    </Button>
                  </Col>
                </Form.Group>
              </Form> 
            </Card> 
          </div>

          <Form>
            <Form.Group as={Row} style={{ marginTop: 30 }}>
              <Col sm="4">
                <Button variant="primary" onClick={ storeProfile }>
                  &nbsp;Save Notifications&nbsp;
                </Button>
              </Col>
            </Form.Group>
          </Form> 
        </div>
      }
    </div>
  )
}

export default NotificationsPage