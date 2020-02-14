import React, { useState, useRef, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useProfile } from '../utils/profile'
import { Button, Modal, Popover, Overlay, Jumbotron, Form } from 'react-bootstrap'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// navbar control and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavDropdown, NavItem as NavbarNavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import '../components/StickyNavbar.css'

import './TourPage.css'

const Buttons = ({prev, next, done}) => 
  <div style={{ display: 'flex', float: 'right', marginBottom: 10 }}>
    { prev && 
    <div style={{ paddingLeft: 10 }}>
      <Button onClick={ prev }>Previous</Button>
    </div>
    }
    { next && 
    <div style={{ paddingLeft: 10 }}>
      <Button onClick={ next }>Next</Button>
    </div>
    }
    <div style={{ paddingLeft: 10 }}>
      <Button onClick={ done }>Done!</Button>
    </div>
  </div>

const Step = ({text, prev, next, done}) => 
  <div>
    <Jumbotron>{text}</Jumbotron>
    <hr />
    <Buttons prev={prev} next={next} done={done}/>
  </div>

const HelpPage = () => {
  const { user } = useAuth0();
  const { profile, storeProfile } = useProfile();

  const [showModal, setShowModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showTour, setShowTour] = useState(true);
  const [step, setStep] = useState(-1);
  const reputation = useRef(null);
  const sources = useRef(null);
  const dashboard = useRef(null);
  const summary = useRef(null);
  const alerts = useRef(null);
  const history = useRef(null);
  const connections = useRef(null);
  const twitter = useRef(null);
  const collapsedWidth = 64;
  const topOffset = 50;

  useEffect(() => {
    reputation && setShowModal(true);
  }, [reputation]);

  const done = () => {
    navigate('/reputation/dashboard');
  }

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      done();
    }
  }

  const prev = () => {
    if (step > -1) {
      setStep(step - 1);
    }
  }

  const end = () => {
    setStep(-1);
    setShowEndModal(true);
  }

  const exitPage = (show = showTour) => {
    profile.skipTour = !show; 
    storeProfile();
    navigate('/reputation/dashboard');
  }

  const steps = [{
    target: reputation,
    placement: 'bottom',
    markup:
      <Popover className="tour" border="dark">
        <Popover.Content as="h5">
          <Step next={next} done={end}
            text={
              <h5>The <strong>Reputation tab</strong> contains all the different views 
              for your online reputation.</h5>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: dashboard,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Reputation Dashboard</strong> is the default page for the app. 
                It gives you a high-level overview of what's going on, and is a great launching point for 
                other pages.</h5>
                <br/>
                <center><img src="/dashboard.png" alt="dashboard" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: summary,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Reputation Summary</strong> page gives a summary of your positive, 
                neutral, and negative reputation, overall and for each reputation source.</h5>
                <br/>
                <center><img src="/summary.png" alt="summary" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: alerts,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Unhandled Feedback</strong> page shows you what new pieces of 
                feedback you haven't yet marked as handled, so you can easily identify items you should 
                respond to, and mark them as handled.</h5>
                <br/>
                <center><img src="/alerts.png" alt="alerts" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: history,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Reputation History</strong> page graphs your reputation over time, 
                both across the board and for each provider.</h5>
                <br/>
                <center><img src="/history.png" alt="history" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: sources,
    placement: 'bottom',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Sources tab</strong> is where you'll configure reputation sources,
                as well as view and handle feedback specific to each of these sources.</h5>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: connections,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Sources page</strong> is where you'll manage your reputation sources. 
                The more sources you connect to, the richer your experience will be!</h5>
                <br/>
                <center><img src="/connections.png" alt="connections" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: twitter,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={end} done={end}
            text={
              <div>
                <h5>Each <strong>Source page</strong> details the feedback specific to that 
                source, allowing you to view and respond to it in its native app, and mark it as handled.</h5>
                <h5>For example, in the Twitter page shown below, the feedback table shows all of your mentions.</h5>
                <br/>
                <center><img src="/twitter.png" alt="twitter" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
  }];

  return(
    <div>
      <div className="stickyNavBarContainer">
        <Navbar className="stickyNavBar">
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav
            navStyle="navbar">
            <NavbarNavItem 
              className="stickyNavBarLogo text-center" 
              style={{ width: 65 }} 
              eventKey="/reputation">
              <img src="/SaaSMaster-logo-220.png" height="40px" alt="logo"/>
            </NavbarNavItem>
            <NavbarNavItem className="navBarItem" eventKey="/reputation" style={{ fontSize: '1.2em' }} ref={reputation}>
              Reputation
            </NavbarNavItem>
            <NavbarNavItem className="navBarItem" eventKey="/sources" style={{ fontSize: '1.2em' }} ref={sources}>
              Sources
            </NavbarNavItem>
            <NavDropdown className="navBarItem" 
              autoOpen
              pullRight
              eventKey="administration"
              title={ user.name }
              style={{ position: 'fixed', right: 0, zIndex: 70, fontsize: '1.2em' }}
            >
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>

      { step < 5 && 
        <div style={{
          width: collapsedWidth,
          position: 'fixed', 
          left: 0,
          top: topOffset,
          height: `calc(100vh - ${topOffset}px)`
          }}>
          <SideNav style={{ minWidth: collapsedWidth }}>
            <SideNav.Toggle />
            <SideNav.Nav>
              <NavItem ref={dashboard} eventKey="/reputation/dashboard">
                <NavIcon>
                  <i className="fa fa-fw fa-tachometer" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Dashboard</NavText>
              </NavItem>
              <NavItem ref={summary} eventKey="/reputation/summary">
                <NavIcon>
                  <i className="fa fa-fw fa-pie-chart" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Summary</NavText>
              </NavItem>
              <NavItem ref={alerts} eventKey="/reputation/alerts">
                <NavIcon>
                  <i className="fa fa-fw fa-bell" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Alerts</NavText>
              </NavItem>
              <NavItem ref={history} eventKey="/reputation/history">
                <NavIcon>
                  <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">History</NavText>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
        </div>
      }

      { step >= 5 && 
        <div style={{
          width: collapsedWidth,
          position: 'fixed', 
          left: 0,
          top: topOffset,
          height: `calc(100vh - ${topOffset}px)`
          }}>
          <SideNav style={{ minWidth: collapsedWidth }}>
            <SideNav.Toggle />
            <SideNav.Nav>
              <NavItem ref={connections} eventKey="/sources/connections">
                <NavIcon>
                  <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Sources</NavText>
              </NavItem>
              <NavItem ref={twitter} eventKey="/sources/twitter">
                <NavIcon>
                  <i className="fa fa-fw fa-twitter" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Twitter</NavText>
              </NavItem>
              <NavItem eventKey="/sources/facebook">
                <NavIcon>
                  <i className="fa fa-fw fa-facebook" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Facebook</NavText>
              </NavItem>
              <NavItem eventKey="/sources/instagram">
                <NavIcon>
                  <i className="fa fa-fw fa-instagram" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Instagram</NavText>
              </NavItem>
              <NavItem eventKey="/sources/google">
                <NavIcon>
                  <i className="fa fa-fw fa-google" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Google</NavText>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
        </div>
      }

      <Modal show={showModal} onHide={ () => {navigate('/reputation/dashboard')} }>
        <Modal.Body>
          <Jumbotron><h1><center>Welcome to <br/> SaaS Master!</center></h1></Jumbotron>
          <h4>
            Here's a quick tour to get you started.  Just click the 'Next' button 
            until you've learned the basics!
          </h4>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={ () => navigate('/reputation/dashboard') }>
            Skip the tour
          </Button>
          <Button variant="secondary" onClick={ () => { exitPage(false) } }>
            Don't show again
          </Button>
          <Button variant="primary" onClick={ () =>  { setShowModal(false); setStep(0); }}>
            Take the tour!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEndModal} onHide={ exitPage }>
        <Modal.Body>
          <Jumbotron><h1><center>That's it!</center></h1></Jumbotron>
          <h5>
            You now have the basics.  Click 'Dashboard' to go to the dashboard, and if 
            you ever need a refresher, this tour is available from the user menu in the 
            top-right corner.  Enjoy!
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Form.Check 
            label={<span style={{ marginRight: 20 }}>&nbsp;Show this tour on startup</span>}
            type="checkbox"
            key="tourCheckbox"
            name="tourCheckbox"
            checked={showTour}
            onChange={ () => setShowTour(!showTour) }
            style={{ fontSize: '1.2em' }}
            />
          <Button variant="primary" onClick={ exitPage }>
            Dashboard
          </Button>
        </Modal.Footer>
      </Modal>

      { step >= 0 && 
        <Overlay 
          show
          target={steps[step].target.current} 
          placement={steps[step].placement}>
          { steps[step].markup }
        </Overlay>
      }

    </div>
  )
}

export default HelpPage