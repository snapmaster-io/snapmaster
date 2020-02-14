import React from 'react'
import { navigate } from 'hookrouter'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './WebsiteFooter.css'

const WebsiteFooter = () => {
  const onClick = (path) => {
    navigate(path);
    window.scrollTo(0,0);
  }

  return (
    <div className="websiteFooter">
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
          <NavItem style={{ position: 'fixed', right: 0 }}>
            Copyright &copy; 2020 SaaS Master
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  )
}

export default WebsiteFooter