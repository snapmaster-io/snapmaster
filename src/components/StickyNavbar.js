import React from 'react'
import PropTypes from 'prop-types'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavDropdown, NavItem, MenuItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './StickyNavbar.css'

import { useAuth0 } from '../utils/react-auth0-wrapper'
import Loading from './Loading'

const StickyNavbar = ({ state, actions }) => {
  const { loading, user, isAdmin, impersonatedUser, logout } = useAuth0();
  if (loading) {
    return (
      <Loading />
    )
  }

  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin
    });
  }

  return (
    <div className="stickyNavBarContainer">
      <Navbar className="stickyNavBar">
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav
          navStyle="navbar"
          activeKey={state.tab}>
          <NavItem 
            className="stickyNavBarLogo text-center" 
            style={{ width: 65 }} 
            eventKey="/reputation" 
            onSelect={actions.selectTab}>
            <img src="/SaaSMaster-logo-220.png" height="40px" alt="logo"/>
          </NavItem>
          <NavItem className="navBarItem" style={{ fontSize: '1.2em' }} eventKey="/reputation" onSelect={actions.selectTab}>
            Reputation
          </NavItem>
          <NavItem className="navBarItem" style={{ fontSize: '1.2em' }} eventKey="/sources" onSelect={actions.selectTab}>
            Sources
          </NavItem>
          <NavDropdown className="navBarItem" 
            autoOpen
            pullRight
            eventKey="administration"
            title={ user.name }
            style={{ position: 'fixed', right: 0, zIndex: 50, fontSize: '1.2em' }}
          >
            <MenuItem eventKey="/profile" onSelect={actions.selectTab}>
              <span style={{ fontSize: '1.2em', color: '#000000a0' }}><i className="fa fa-fw fa-user" />&nbsp;Profile</span>
            </MenuItem>
            <MenuItem eventKey="/notifications" onSelect={actions.selectTab}>
              <span style={{ fontSize: '1.2em', color: '#000000a0' }}><i className="fa fa-fw fa-bell" />&nbsp;Notifications</span>
            </MenuItem>
            <MenuItem eventKey="/tour" onSelect={actions.selectTab}>
              <span style={{ fontSize: '1.2em', color: '#000000a0' }}><i className="fa fa-fw fa-info-circle" />&nbsp;Tour</span>
            </MenuItem>
            {
              isAdmin && 
              <MenuItem eventKey="/admin" onSelect={actions.selectTab}>
                <span style={{ fontSize: '1.2em', color: '#000000a0' }}><i className="fa fa-fw fa-lock" />&nbsp;Admin</span>
              </MenuItem>
            }
            <MenuItem divider />
            <MenuItem eventKey="logout" onSelect={() => { logoutWithRedirect() }}>
              <span style={{ fontSize: '1.2em', color: '#000000a0' }}><i className="fa fa-fw fa-sign-out" />&nbsp;Logout</span>
            </MenuItem>
          </NavDropdown>
          {
            isAdmin && impersonatedUser &&
            <NavItem className="navBarItem">
              Impersonating: { impersonatedUser }
            </NavItem>
          }
        </Nav>
      </Navbar>
    </div>
  )
}

StickyNavbar.propTypes = {
  tab: PropTypes.object,
  actions: PropTypes.object
}

export default StickyNavbar