import React, { useState } from 'react'
import RefreshButton from '../components/RefreshButton'
import { Form, Col, Row, Image, Card, CardDeck, Button, Alert } from 'react-bootstrap'
import { useConnections } from '../utils/connections'
import { useProfile } from '../utils/profile'

const ProfilePage = () => {
  const { connections } = useConnections();
  const { profile, loadProfile, storeProfile, loading } = useProfile();
  const [alertText, setAlertText] = useState();

  const name = profile && profile.name;
  const picture = profile && profile.picture;
  const lastLogin = profile && profile.last_login && new Date(profile.last_login).toLocaleString();

  const connectionCards = profile && profile.identities && 
        connections && connections.map && connections.map(connection => {
    // set up some variables
    const connected = connection.connected ? true : false;
    const color = connected ? 'success' : 'danger';
    const [providerTitle] = connection.provider.split('-');
    const label = <i className={`fa fa-fw fa-${providerTitle} text-${color}`} style={{ fontSize: '1.2em' }} />;
    const provider = profile.identities.find(p => p.provider === connection.provider);
    const userName = (provider && provider.profileData && provider.profileData.name) || name;
    const userPicture = (provider && provider.profileData && provider.profileData.picture) || picture;
    const screenName = provider && provider.profileData && provider.profileData.screen_name;
    const location = provider && provider.profileData && provider.profileData.location;

    return {
      connected,
      color,
      providerTitle,
      label,
      userName,
      userPicture,
      screenName,
      location
    }
  });

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

          <br/>

          <Card border="secondary">
            <CardDeck style={{ padding: 20 }}>
            { 
              connectionCards && connectionCards.map((connection, key) => {
                return (
                  <Card 
                    key={key} 
                    className='mx-auto'
                    border={connection.color}
                    style={{ 
                      maxWidth: '200px', 
                      minWidth: '200px', 
                      minHeight: '150px', 
                      marginBottom: '10px',
                      marginTop: '10px',
                      textAlign: 'center' 
                    }}>
                    <Card.Header>{connection.label}</Card.Header>
                    <Card.Body>
                      <Card.Title>{ connection.connected && connection.userName }</Card.Title>
                      { connection.connected && connection.userPicture && 
                        <center><Card.Img variant="top" src={connection.userPicture} style={{ width: '6rem', margin: '10px' }}/></center>
                      }
                      { connection.connected && connection.screenName && <Card.Subtitle><p>@{connection.screenName}</p></Card.Subtitle> }
                      { connection.connected && connection.location && <Card.Subtitle>{connection.location}</Card.Subtitle> }
                    </Card.Body>
                  </Card>    
                )
              })
            }
            </CardDeck>     
          </Card>          
        </div>
      }
    </div>
  )
}

export default ProfilePage