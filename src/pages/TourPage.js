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

const TourPage = () => {
  const { user } = useAuth0();
  const { profile, storeProfile } = useProfile();

  const [showModal, setShowModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showTour, setShowTour] = useState(true);
  const [step, setStep] = useState(-1);
  const snaps = useRef(null);
  const tools = useRef(null);
  const dashboard = useRef(null);
  const installed = useRef(null);
  const gallery = useRef(null);
  const mySnaps = useRef(null);
  const library = useRef(null);
  const connections = useRef(null);
  const collapsedWidth = 64;
  const topOffset = 50;

  useEffect(() => {
    snaps && setShowModal(true);
  }, [snaps]);

  const done = () => {
    navigate('/snaps/dashboard');
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

  const exitPage = (showFlag) => {
    if (showFlag === null) {
      showFlag = showTour;
    }
    profile.skipTour = !showFlag; 
    storeProfile();
    navigate('/snaps/dashboard');
  }

  const steps = [{
    target: snaps,
    placement: 'bottom',
    markup:
      <Popover className="tour" border="dark">
        <Popover.Content as="h5">
          <Step next={next} done={end}
            text={
              <h5>The <strong>Snaps tab</strong> is where you'll find and activate snaps.</h5> 
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
                <h5>The <strong>Dashboard</strong> is the default page for the app. 
                It gives you a high-level overview of what's going on, and is a great launching point for 
                other pages.</h5>
                <br/>
                <center><img src="/dashboard.png" alt="dashboard" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: installed,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Active Snaps</strong> page shows you all your active snaps, 
                allows you to pause and resume them, and lets you check out the logs.</h5>
                <br/>
                <center><img src="/summary.png" alt="summary" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: gallery,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Gallery</strong> page shows you all of the existing snaps that are available - 
                either built-in or snaps that other users have created and made public.  You can activate these  
                snaps, fork and modify them, or create your own from scratch.</h5>
                <br/>
                <center><img src="/gallery.png" alt="gallery" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: mySnaps,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>My Snaps</strong> page shows you all the snaps in your own account, 
                whether you've forked them from an existing snap or created a new one.</h5>
                <br/>
                <center><img src="/mysnaps.png" alt="my snaps" style={{ maxHeight: 'calc(40vh)' }} /></center>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: tools,
    placement: 'bottom',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Tools tab</strong> is where you'll view the library of tools at your disposal, 
                as well as connect the specific tools that you'd like to use in your snaps.</h5>
              </div>
            }/>
        </Popover.Content>
      </Popover>
    }, {
    target: library,
    placement: 'right',
    markup:
      <Popover className="tour">
        <Popover.Content as="h5">
          <Step prev={prev} next={next} done={end}
            text={
              <div>
                <h5>The <strong>Library page</strong> contains all of the tools that are currently available  
                in SnapMaster.  Select a tool to connect it with your organization's tenant information. </h5>
                <h5>Once it's connected, the tool will show up in your Connections.</h5>
                <br/>
                <center><img src="/library.png" alt="library" style={{ maxHeight: 'calc(40vh)' }} /></center>
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
          <Step prev={prev} next={end} done={end}
            text={
              <div>
                <h5>The <strong>Connections page</strong> is where you'll manage your connections to the tools you select to use. 
                The more tools you connect to, the richer your experience will be!</h5>
                <br/>
                <center><img src="/connections.png" alt="connections" style={{ maxHeight: 'calc(40vh)' }} /></center>
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
              eventKey="/snaps">
              <img src="/SnapMaster-logo-220.png" height="40px" alt="logo"/>
            </NavbarNavItem>
            <NavbarNavItem className="navBarItem" eventKey="/snaps" style={{ fontSize: '1.2em' }}>
              <span ref={snaps}>Snaps</span>
            </NavbarNavItem>
            <NavbarNavItem className="navBarItem" eventKey="/tools" style={{ fontSize: '1.2em' }}>
              <span ref={tools}>Tools</span>
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
              <NavItem eventKey="/snaps/dashboard">
                <NavIcon>
                  <i ref={dashboard} className="fa fa-fw fa-tachometer" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Dashboard</NavText>
              </NavItem>
              <NavItem eventKey="/snaps/summary">
                <NavIcon>
                  <i ref={installed} className="fa fa-fw fa-play" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Installed Snaps</NavText>
              </NavItem>
              <NavItem eventKey="/snaps/gallery">
                <NavIcon>
                  <i ref={gallery} className="fa fa-fw fa-sitemap" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">Gallery</NavText>
              </NavItem>
              <NavItem eventKey="/snaps/mysnaps">
                <NavIcon>
                  <i ref={mySnaps} className="fa fa-fw fa-code" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText className="navText">My Snaps</NavText>
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
            <NavItem eventKey="/tools/library">
                <NavIcon>
                  <i ref={library} className="fa fa-fw fa-university" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Library</NavText>
              </NavItem>
              <NavItem eventKey="/tools/connections">
                <NavIcon>
                  <i ref={connections} className="fa fa-fw fa-usb" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Connections</NavText>
              </NavItem>
              <NavItem eventKey="/tools/aws">
                <NavIcon>
                  <i ref={connections} className="cloudfont-aws" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>AWS</NavText>
              </NavItem>
              <NavItem eventKey="/tools/docker">
                <NavIcon>
                  <i ref={connections} className="cloudfont-docker" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Docker</NavText>
              </NavItem>
              <NavItem eventKey="/tools/github">
                <NavIcon>
                  <i ref={connections} className="cloudfont-github" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Github</NavText>
              </NavItem>
              <NavItem eventKey="/tools/slack">
                <NavIcon>
                  <i ref={connections} className="cloudfont-slack" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText>Slack</NavText>
              </NavItem>
            </SideNav.Nav>
          </SideNav>
        </div>
      }

      <Modal show={showModal} onHide={ () => {navigate('/snaps/dashboard')} }>
        <Modal.Body>
          <Jumbotron><h1><center>Welcome to <br/> SnapMaster!</center></h1></Jumbotron>
          <h4>
            Here's a quick tour to get you started.  Just click the 'Next' button 
            until you've learned the basics!
          </h4>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={ () => navigate('/snaps/dashboard') }>
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

      <Modal show={showEndModal} onHide={ () => { exitPage(null) } }>
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
          <Button variant="primary" onClick={ () => { exitPage(null) } }>
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

export default TourPage