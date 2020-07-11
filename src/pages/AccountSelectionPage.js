import React, { useState, useCallback, useEffect } from 'react'
import { navigate } from 'hookrouter'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useProfile } from '../utils/profile'
import { Button, Modal, Jumbotron, FormControl, InputGroup } from 'react-bootstrap'

// navbar control and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavDropdown, NavItem as NavbarNavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import '../components/StickyNavbar.css'

import './AccountSelectionPage.css'

const AccountSelectionPage = () => {
  const { user } = useAuth0();
  const { get, post } = useApi();
  const { profile, storeProfile } = useProfile();

  // account names must start with a-z, and must be alphanumeric 1-20 characters
  const validateAccountName = (value) => {
    const re = /^[a-z]\w{0,19}$/;
    const acct = String(value).toLowerCase();
    return re.test(acct);
  }

  const [account, setAccount] = useState(validateAccountName(user.nickname) ? user.nickname : "");
  const [valid, setValid] = useState(false);
  const [validationNeeded, setValidationNeeded] = useState(true);

  // create a callback function that wraps the loadData effect
  const validateAccount = useCallback(() => {
    async function call(accountName) {
      const [response, error] = await get(`validateaccount?account=${accountName}`);
      if (error || !response.ok) {
        setValid(false);
        return;
      }
      const item = await response.json();
      if (item && item.valid) {
        setValid(true);
      } else {
        setValid(false);
      }
    }
    if (validationNeeded) {
      call(account);
    }
  }, [get, account, validationNeeded]);

  // validate account every time the account name is set (including first load)
  useEffect(() => {
    validateAccount();
  }, [validateAccount]);

  // account can never be reset
  if (profile.account) {
    navigate('/');
  }

  const validate = (value) => {
    if (validateAccountName(value)) {
      setValidationNeeded(true);
    } else {
      setValidationNeeded(false);
      setValid(false);
    }
    setAccount(value);
  }

  const storeAccount = async () => {
    // first, claim the account name
    const [response, error] = await post(`validateaccount/${account}`);
    if (error || !response.ok) {
      setValid(false);
      return;
    }

    const item = await response.json();
    if (item && item.status === 'error') {
      setValid(false);
      return;
    }

    // now that the account name has been stored as a user, also store it in profile
    profile.account = account; 
    storeProfile();
    navigate('/');
  }

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
              <span>Snaps</span>
            </NavbarNavItem>
            <NavbarNavItem className="navBarItem" eventKey="/tools" style={{ fontSize: '1.2em' }}>
              <span>Tools</span>
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

      <Modal show={true} dialogClassName="modal-90w">
        <Modal.Body>
          <Jumbotron>
            <h1><center>Welcome to SnapMaster!</center></h1>
          </Jumbotron>
          <h5>
            Hi {user.name.split(' ')[0]}, welcome to SnapMaster!  First things first: please select 
            an account (tenant) name, so we can set things up for you.  
          </h5>
          <h5>
            Your account will be part of the namespace that will identify your snaps, 
            much like your github account is used to name your repos. You can't change it 
            later, so pick a good one! <i className="fa fa-smile-o" />
          </h5>
          <h5>
            Account names must start with a letter and must be entirely composed of 
            alphanumeric characters, with a 20 character limit.
          </h5>
          <br />
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">Account name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              aria-label="account"
              aria-describedby="inputGroup-sizing-default"
              value={account}
              onChange={(e) => { validate(e.target.value) }}
            />
            &nbsp;&nbsp;
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
              { valid ? <span><i className="fa fa-check text-success" />&nbsp;&nbsp;available!</span> 
                      : <span><i className="fa fa-times text-danger" />&nbsp;&nbsp;not available</span>
              }
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={!valid} onClick={storeAccount}>
            Lock it in!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AccountSelectionPage