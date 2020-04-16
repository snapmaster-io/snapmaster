import React from 'react'
import { navigate } from 'hookrouter'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './WebsiteFooter.css'

const WebsiteFooter = ({className}) => {
  const onClick = (path) => {
    navigate(path);
    window.scrollTo(0,0);
  }

  return (
    <div className={className}>
      <Navbar>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav navStyle="navbar" className="navbarFooter">
          <NavItem onSelect={() => onClick('/terms')}>
            Terms
          </NavItem>
          <NavItem onSelect={() => onClick('/privacy')}>
            Privacy
          </NavItem>
          <NavItem onSelect={() => window.open('https://github.com/snapmaster-io', 'github')}>
            <i className="fa fa-github" />&nbsp;&nbsp;&nbsp;SnapMaster on Github
          </NavItem>
          <NavItem onSelect={() => window.open('https://snapmaster.slack.com', 'slack')}>
            <i className="fa fa-slack" />&nbsp;&nbsp;&nbsp;Community
          </NavItem>
          <NavItem style={{ float: 'right' }}>
            Copyright &copy; 2020 SnapMaster
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  )
}

export default WebsiteFooter