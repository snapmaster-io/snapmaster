import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { post } from '../utils/api'
import { Button, Carousel, Modal, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap'
import { isBrowser, isMobile } from 'react-device-detect'
import Loading from '../components/Loading'
import LandingPageToolCardDeck from '../components/LandingPageToolCardDeck'
import ValueProp from '../components/ValueProp'
import WebsiteFooter from '../components/WebsiteFooter'
import './LandingPage.css'

const LandingPage = () => {
  const { loading, loginWithRedirect } = useAuth0();
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const betaFlag = true;

  if (loading) {
    return (
      <Loading />
    );
  }

  const login = () => {
    // private beta - put up beta code validation UI
    if (betaFlag) {
      setShowValidateModal(true);
      return;
    }

    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      //connection_scope: 'https://www.googleapis.com/auth/cloud-platform',
      //connection: 'google-oauth2',
      // this is how to combine more than one permission
      //connection_scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly', 
      //prompt: 'consent',  // this re-prompts consent and returns refresh token
      redirect_uri: `${window.location.origin}`,
    });
  }

  const signUp = (beta) => {
    // private beta - put up email collection UI
    if (beta) {
      setShowBetaModal(true);
      return;
    }

    // put up Sign Up screen
    loginWithRedirect({
      access_type: 'offline', 
      redirect_uri: `${window.location.origin}`,
      snapmaster_mode: 'signUp',
    });
  }

  const requestAccess = async () => {
    try {
      setShowBetaModal(false);
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
      const payload = { 
        email: email,
        code: code
      }
      const [response, error] = await post(createToken(email), 'validatecode', JSON.stringify(payload));
      if (error || !response.ok) {
        setInvalidCode(true);
      }
  
      const data = await response.json();
      if (data.email === email) {
        // put up Sign Up screen
        loginWithRedirect({
          access_type: 'offline', 
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
          }} size="lg" disabled={loading} onClick={() => login()}>
            <i className="fa fa-user" />&nbsp;&nbsp;Log In
          </Button>
        }
        { isDesktopDevice && 
          <Button style={{ 
            position: 'fixed', 
            right: 150, 
            top: 20,
            zIndex: 200 
          }} 
            size="lg" 
            variant="light"
            disabled={loading} 
            onClick={() => window.open('https://github.com/snapmaster-io', 'github')}
          >
            <i className="fa fa-github" />&nbsp;&nbsp;GitHub
          </Button>
        }
        <div style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          padding: 10,
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
          <h4>
            Effortlessly automate your manual, error-prone, 
            soul-crushing integration busywork.
          </h4>
          <br />
          <h4>
            <strong>Focus on what matters.</strong>
          </h4>
          { isDesktopDevice && <br/> }
          { isDesktopDevice && 
            <Button size="lg" style={{ paddingTop: 20, paddingBottom: 20}} variant="info" disabled={loading} onClick={() => signUp(betaFlag)}>
              <i className="fa fa-flash" />&nbsp;&nbsp;Get started
            </Button>          
          }
          { false &&
            <div style={{ display: 'flex', alignItestims: 'center', justifyContent: 'center' }}>
              <Button style={{ margin: 20 }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
              <Button style={{ margin: 20 }} size="lg" variant="info" disabled={loading} onClick={() => signUp(betaFlag)}>Get started</Button>          
            </div>
          }
          { isMobileDevice && 
            <div>
              <br />
              <span>Currently only supporting desktop browsers <i className="fa fa-smile-o" /></span>
            </div>
          }
        </div>

        { isDesktopDevice && 
        <div className="benefits-desktop">
          <h1>Master your DevOps Toolchain</h1>
          <br/>
          <Container style={{ maxWidth: 1200 }}>
            <Row>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-cloud"></i>
                  Integrate
                </h3>
                <p>Integrate all the DevOps tools you use today</p>
                <br/>
                <div className="tool-icons">
                  <img className="tool-icon" src="/github-logo-small.png" alt="github" height="50px" />
                  <img className="tool-icon" src="/gitlab-logo.png" alt="gitlab" height="50px" />
                  <img className="tool-icon" src="/bitbucket-logo.png" alt="bitbucket" height="50px" />
                  <img className="tool-icon" src="/netlify-logo.png" alt="netlify" height="50px" />
                </div>
                <div className="tool-icons">
                  <img className="tool-icon" src="/aws-logo.png" alt="aws" height="50px" />
                  <img className="tool-icon" src="/azure-logo.png" alt="azure" height="50px" />
                  <img className="tool-icon" src="/gcp-logo-small.png" alt="gcp" height="50px" />
                  <img className="tool-icon" src="/kubernetes-logo.png" alt="kubernetes" height="50px" />
                </div>
                <div className="tool-icons">
                  <img className="tool-icon" src="/docker-logo.png" alt="docker" height="50px" />
                  <img className="tool-icon" src="/slack-logo.png" alt="slack" height="50px" />
                  <img className="tool-icon" src="/pagerduty-logo.png" alt="pagerduty" height="50px" />
                  <img className="tool-icon" src="/twilio-logo.png" alt="twilio" height="50px" />
                </div>
              </Col>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-cogs"></i>
                  Automate
                </h3>
                <p>Create workflows called 'snaps' that get triggered by events, and fire off actions</p>
                <img src="/snaps.png" alt="snap" width="326px"  />
              </Col>
              <Col>
                <h3>
                  <i className="soc-icon fa fa-xl fa-share-alt"></i>
                  Share
                </h3>
                <p>Share snaps across your entire team, so no one has to reinvent the wheel</p>
                <img src="/snapyaml.png" alt="snap" height="200px" />
              </Col>
            </Row>
          </Container>
        </div>
        }
      </div>

      { isDesktopDevice && 
      <div>
        <ValueProp 
          text="Choose from a set of common snaps in the gallery, or create your own"
          background='white'
        />

        <div className='carousel-container'>
          <Carousel>
            <Carousel.Item 
              className="bg-carousel" 
              style={{ 
                background: 'linear-gradient(rgba(1,1,1,0), rgba(1,1,1,0)), url("/snap1.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
              }}>
              <Carousel.Caption>
                <h3><strong>Incident management:</strong></h3>
                <br/>
                <h4>
                  Azure new-file 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Github create-issue 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Pagerduty create-incident 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Slack send 
                </h4>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item 
              className="bg-carousel" 
              style={{ 
                background: 'linear-gradient(rgba(1,1,1,0), rgba(1,1,1,0)), url("/snap2.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
              }}>
              <Carousel.Caption>
                <h3><strong>Container deployment:</strong></h3>
                <br/>
                <h4>
                  Github push 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Docker build 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  AWS ecs-update 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Twilio send 
                </h4>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item 
              className="bg-carousel" 
              style={{ 
                background: 'linear-gradient(rgba(1,1,1,0), rgba(1,1,1,0)), url("/snap3.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
              }}>
              <Carousel.Caption>
                <h3><strong>Continuous integration / continuous deployment:</strong></h3>
                <br/>
                <h4>
                  Gitlab push 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Circle-CI build 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  GCP build 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Slack send 
                </h4>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item 
              className="bg-carousel" 
              style={{ 
                background: 'linear-gradient(rgba(1,1,1,0), rgba(1,1,1,0)), url("/snap4.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'contain',
              }}>
              <Carousel.Caption>
                <h3><strong>ChatOps:</strong></h3>
                <br/>
                <h4>
                  Slack message 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Gitlab build
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  Docker build 
                  &nbsp;<i className="fa fa-arrow-right" />&nbsp;
                  GCP deploy 
                </h4>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>

        <ValueProp 
          text="Connect all of the tools you use to build, deploy, and monitor cloud applications"
          background='black'
        />

        <LandingPageToolCardDeck />

        <ValueProp 
          text="Tailor the snaps your team uses to the policies and constraints of your organization"
          image='policy.png'
          background='white'
        />

        <ValueProp 
          text="Review a complete audit trail of all the invoked actions"
          image='logs.png'
          background='black'
        />

        <ValueProp 
          text="Visualize time-series data on all executed snaps"
          image='history.png'
          background='white'
        />

        <ValueProp 
          text="Extend the system with your own integrations - it's all open source!"
          image='yaml.png'
          background='black'
        />
      </div>
      }

      { isDesktopDevice && <WebsiteFooter className="landingFooter" /> }

      <Modal show={showBetaModal} onHide={ () => { setShowBetaModal(false) } }>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => { setShowBetaModal(false); setShowValidateModal(true); }}>
            I have a code!
          </Button>
          <Button variant="primary" disabled={ !validateEmail(email) } onClick={ requestAccess }>
            Request access
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showValidateModal} onHide={ () => { setShowValidateModal(false) } }>
        <Modal.Header closeButton>
          <Modal.Title>SnapMaster is in private beta.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter your email address and the access code you obtained below to login.  If you haven't 
            requested access yet, now's the time!</p>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default" style={{ width: 120 }}>Email</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="email"
              aria-describedby="inputGroup-sizing-default"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default" style={{ width: 120 }}>Access code</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="code"
              aria-describedby="inputGroup-sizing-default"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </InputGroup>
          { invalidCode && <p className="text-danger">Invalid code - please request access to obtain a valid code</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => { setInvalidCode(false); setShowValidateModal(false); setShowBetaModal(true); } }>
            Request access
          </Button>
          <Button variant="primary" disabled={ !validateEmail(email) } onClick={ () => { setInvalidCode(false); validateCode(); }}>
            Validate my code!
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
  )
}

export default LandingPage