import React, { useState } from 'react'
import { useProfile } from '../utils/profile'
import { Form, Col, Row, Image, Card, Button, Alert } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'

const ProfilePage = () => {
  const { profile, loadProfile, storeProfile, loading } = useProfile();
  const [alertText, setAlertText] = useState();

  const picture = profile && profile.picture;
  const lastLogin = profile && profile.last_login && new Date(profile.last_login).toLocaleString();

  const updateProfile = () => {
    if (!validateEmail(profile.email)) {
      setAlertText("Invalid email address");
      return;
    }

    if (!validatePhone(profile.phone)) {
      setAlertText("Invalid phone number");
      return;
    }

    setAlertText(null);
    storeProfile();
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validatePhone = (phone) => {
    const re = /^[+]{0,1}[0-9]{1,3}[-\s.]{0,1}[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/g;
    return re.test(phone);
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
        <h4 className="page-title">Profile</h4>
      </div>
      {
        alertText && 
        <Alert variant="danger" show={alertText} onClose={() => setAlertText(null)} dismissible>{alertText}</Alert>
      }
      { 
        profile && 
        <div>
          <div style={{display: 'flex'}}>
            <Card border="secondary" style={{ minWidth: 'calc(100% - 220px)', maxWidth: 'calc(100% - 220px)'}}>
              <Form>
                <div>
                  <Form.Group as={Row} style={{ margin: 20 }}>
                    <Form.Label column sm="2">Name: </Form.Label>
                      <Col sm="10">
                        <Form.Control defaultValue={profile.name} onChange={ (e) => { profile.name = e.target.value }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ margin: 20 }}>
                      <Form.Label column sm="2">Email: </Form.Label>
                      <Col sm="10">
                        <Form.Control defaultValue={profile.email} onChange={ (e) => { profile.email = e.target.value }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ margin: 20 }}>
                      <Form.Label column sm="2">Phone: </Form.Label>
                      <Col sm="10">
                        <Form.Control defaultValue={profile.phone} onChange={ (e) => { profile.phone = e.target.value }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} style={{ margin: 20 }}>
                      <Form.Label column sm="2">Last login: </Form.Label>
                      <Col sm="8">
                        <Form.Control plaintext readOnly defaultValue={lastLogin} />
                      </Col>
                      <Col sm="2">
                        <Button style={{ float: 'right' }} variant="primary" onClick={ updateProfile }>
                          &nbsp;Update&nbsp;
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
              </Form> 
            </Card> 

            <Card border="secondary" style={{ width: 200, marginLeft: 20}}>
              <Image src={picture} style={{ height: 150, width: 150, margin: 20 }} roundedCircle />
            </Card>
          </div>
        </div>
      }
    </div>
  )
}

export default ProfilePage