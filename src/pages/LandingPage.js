import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { post } from '../utils/api'
import Loading from '../components/Loading'
import WebsiteFooter from '../components/WebsiteFooter'
import { Button, Carousel, Modal, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap'
import { isBrowser, isMobile } from 'react-device-detect'
import './LandingPage.css'

const LandingPage = () => {
  const { loading, loginWithRedirect } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [email, setEmail] = useState();
  const betaFlag = true;

  if (loading) {
    return (
      <Loading />
    );
  }

  const login = () => {
    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      //connection: 'google-oauth2',
      //connection_scope: 'https://www.googleapis.com/auth/contacts.readonly',
      // this is how to combine more than one permission
      //connection_scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly', 
      //connection_scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/business.manage',
      //connection_scope: 'https://www.googleapis.com/auth/calendar',
      // this is the Google business scope, but can't actually use it!
      //connection_scope: 'https://www.googleapis.com/auth/business.manage', 
      //prompt: 'consent',  // this re-prompts consent and returns refresh token
      redirect_uri: `${window.location.origin}`,
    });
  }

  const signUp = (beta) => {
    // private beta - put up email collection UI
    if (beta) {
      setShowModal(true);
      return;
    }

    // put up Sign Up screen
    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      //connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // unverified BUT THIS MAY BE IT
      redirect_uri: `${window.location.origin}`,
      snapmaster_mode: 'signUp',
    });
  }

  const requestAccess = async () => {
    try {
      setShowModal(false);
      await post(createToken(email), 'requestaccess', JSON.stringify({ email: email }));
    } catch (error) {
    }
  }

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validateCode = async () => {
    try {
      const [response, error] = await post(createToken(email), 'validatecode', JSON.stringify({ email: email }));
      if (error || !response.ok) {
        setInvalidCode(true);
      }
  
      const data = await response.json();
      if (data.email === email) {
        // put up Sign Up screen
        loginWithRedirect({
          access_type: 'offline', // unverified - asks for offline access
          //connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // unverified BUT THIS MAY BE IT
          redirect_uri: `${window.location.origin}`,
          snapmaster_mode: 'signUp',
        });
      }  
    } catch (error) {
      setInvalidCode(true);
    }
  }

  const createToken = (data) => {
    return Buffer.from(data + 'SnapMaster').toString('base64');
  }
  
  let isMobileDevice = isMobile;
  let isDesktopDevice = isBrowser;
  //isMobileDevice = true; 
  //isDesktopDevice = false;

  return (
    <div className="Landing">
      <div className={ isDesktopDevice ? "bg-overlay bg-overlay-desktop" : "bg-overlay bg-overlay-mobile" }>
        { isDesktopDevice && 
          <Button style={{ 
            position: 'fixed', 
            right: 20, 
            top: 20,
            zIndex: 200 
          }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
        }
        <div style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          padding: 20,
          zIndex: 100,
          width: '100vw',
          backgroundColor: `rgba(0, 0, 0, 1.0)`
        }}>
          <img src="/SnapMaster-logo-220.png" className="Landing-logo" alt="logo"/>
          <h1 style={ isDesktopDevice ? { fontSize: '3em' } : { fontsize: '2em' } }>SnapMaster</h1>
        </div>

        <div className={ isDesktopDevice ? "tagline-desktop" : "tagline-mobile" }>
          <h1>The Definitive DevOps Integration Platform</h1>
          <br/>
          <h5>
            Effortlessly automate your manual, error-prone, 
            soul-crushing integration busywork.
          </h5>
          <h5>
            <strong>Focus on what matters.</strong>
          </h5>
          { isDesktopDevice && <br/> }
          { isDesktopDevice && 
            <Button size="lg" variant="info" disabled={loading} onClick={() => signUp(betaFlag)}>Get started</Button>          
          }
          { isMobileDevice &&
            <div style={{ display: 'flex', alignItestims: 'center', justifyContent: 'center' }}>
              <Button style={{ margin: 20 }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
              <Button style={{ margin: 20 }} size="lg" variant="info" disabled={loading} onClick={() => signUp(betaFlag)}>Get started</Button>          
            </div>
          }
        </div>

        <div className={ isDesktopDevice ? "benefits-desktop" : "tagline-mobile" }>
          <h1>Master your DevOps Toolchain</h1>
          { isDesktopDevice && <br/> }

          <Container>
            <Row>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-cloud"></i>
                  Integrate
                </h3>
                <p>Integrate all the DevOps tools you use today</p>
                <br/>
                <div className="tool-icons">
                  <img className="tool-icon" src="github-logo.png" alt="github" height="50px" />
                  <img className="tool-icon" src="gitlab-logo.png" alt="gitlab" height="50px" />
                  <img className="tool-icon" src="circleci-logo.png" alt="circle-ci" height="50px" />
                </div>
                <div className="tool-icons">
                  <img className="tool-icon" src="kubernetes-logo.png" alt="kubernetes" height="50px" />
                  <img className="tool-icon" src="gcp-logo.png" alt="gcp" height="50px" />
                  <img className="tool-icon" src="slack-logo.png" alt="slack" height="50px" />
                </div>
              </Col>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-cogs"></i>
                  Automate
                </h3>
                <p>Create workflows called 'snaps' that get triggered by events, and fire off actions</p>
              </Col>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-share-alt"></i>
                  Share
                </h3>
                <p>Share workflows across your entire team, so no one has to reinvent the wheel</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Carousel>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/connections.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
          }}>
          <Carousel.Caption>
            <h3><strong>Connect all of the tools you use to build cloud applications</strong></h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/dashboard.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
          }}>
          <Carousel.Caption>
            <h3><strong>Choose from a set of common snaps in the gallery, or create your own</strong></h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/alerts.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
          }}>
          <Carousel.Caption>
            <h3><strong>Tailor the snaps your team uses to the policies and constraints of your organization</strong></h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/history.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
          }}>
          <Carousel.Caption>
            <h3><strong>Review a complete audit trail of all the invoked actions</strong></h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/email.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'contain',
          }}>
          <Carousel.Caption>
            <h3><strong>Extend the system with your own integrations - it's all open source!</strong></h3>
          </Carousel.Caption>
        </Carousel.Item>        
      </Carousel>

      { isDesktopDevice && <WebsiteFooter className="landingFooter" /> }

      <Modal show={showModal} onHide={ () => { setShowModal(false) } }>
        <Modal.Header closeButton>
          <Modal.Title>SnapMaster is in private beta.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your email address below and we'll add you to our waiting list.  We'll send you
            an email with sign-up instructions once we're ready to bring you on board!</p>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="email"
              aria-describedby="inputGroup-sizing-default"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <p>As a token of our appreciation, private beta participants get one <b>free year of SnapMaster Premium</b> once it launches!</p>
          { invalidCode && <p className="text-danger">Invalid code - please request access to obtain a valid code</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => { setInvalidCode(false); validateCode(); }}>
            I have a code!
          </Button>
          <Button variant="primary" disabled={ !validateEmail(email) } onClick={ requestAccess }>
            Request access
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default LandingPage