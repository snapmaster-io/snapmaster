import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { post } from '../utils/api'
import Loading from '../components/Loading'
import WebsiteFooter from '../components/WebsiteFooter'
import { Button, Carousel, Modal, InputGroup, FormControl } from 'react-bootstrap'
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
      saasmaster_mode: 'signUp',
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
          saasmaster_mode: 'signUp',
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
          backgroundColor: `rgba(0, 0, 0, ${ isMobileDevice ? 1.0 : 0.0 })`
        }}>
          <img src="/SnapMaster-logo-220.png" className="Landing-logo" alt="logo"/>
          <h1 style={ isDesktopDevice ? { fontSize: '3em' } : { fontsize: '2em' } }>SnapMaster</h1>
        </div>

        <div className={ isDesktopDevice ? "tagline-desktop" : "tagline-mobile" }>
          <h1>Master your DevOps Toolchain</h1>
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
            <h3><strong>Connect all of the tools you use for your online business identity</strong></h3>
            <i className="soc-icon fa fa-lg fa-facebook-square"></i>
            <i className="soc-icon fa fa-lg fa-twitter"></i>
            <i className="soc-icon fa fa-lg fa-google"></i>
            <i className="soc-icon fa fa-lg fa-yelp"></i>
            <i className="soc-icon fa fa-lg fa-instagram"></i>
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
            <h3><strong>View all user feedback for your business from one console</strong></h3>
            <i className="soc-icon fa fa-lg fa-comment-o"></i>
            <i className="soc-icon fa fa-lg fa-heart-o"></i>
            <i className="soc-icon fa fa-lg fa-hashtag"></i>
            <i className="soc-icon fa fa-lg fa-map-marker"></i>
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
            <h3><strong>Effortlessly prioritize and reply to positive and negative feedback</strong></h3>
            <i className="soc-icon fa fa-lg fa-thumbs-o-up"></i>
            <i className="soc-icon fa fa-lg fa-thumbs-o-down"></i>
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
            <h3><strong>Track your reputation over time with beautiful charts</strong></h3>
            <i className="soc-icon fa fa-lg fa-tachometer"></i>
            <i className="soc-icon fa fa-lg fa-pie-chart"></i>
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
            <h3><strong>Get email or SMS notifications when new reviews roll in</strong></h3>
            <i className="soc-icon fa fa-lg fa-envelope"></i>
            <i className="soc-icon fa fa-lg fa-phone"></i>
          </Carousel.Caption>
        </Carousel.Item>        
      </Carousel>

      { isDesktopDevice && <WebsiteFooter /> }

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