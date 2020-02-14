import React from 'react'
import { navigate } from 'hookrouter'
import { useAuth0 } from '../utils/react-auth0-wrapper'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './StickyNavbar.css'
import './WebsiteNavbar.css'

const WebsiteNavbar = () => {
  const { loginWithRedirect } = useAuth0();

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

  return (
    <div className="stickyNavBarContainer websiteNavBarContainer">
      <Navbar className="stickyNavBar websiteNavbar">
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav navStyle="navbar">
          <NavItem 
            className="stickyNavBarLogo text-center" 
            style={{ width: 65 }} 
            onSelect={ () => navigate('/')}>
            <img src="/SaaSMaster-logo-220.png" height="40px" alt="logo"/>
          </NavItem>
          <NavItem 
            className="navBarItem"
            style={{ position: 'fixed', right: 0 }}
            onSelect={login}>
            Login
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  )
}

export default WebsiteNavbar