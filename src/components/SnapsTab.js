import React, { useState } from 'react'
import { useRoutes, navigate } from 'hookrouter'
import { useProfile } from '../utils/profile'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import Dashboard from '../pages/Dashboard'
import ActiveSnapsPage from '../pages/ActiveSnapsPage'
import GalleryPage from '../pages/GalleryPage'
import MySnapsPage from '../pages/MySnapsPage'
import MyActionsPage from '../pages/MyActionsPage'
import LogsPage from '../pages/LogsPage'
import HistoryPage from '../pages/HistoryPage'
import SnapPage from '../pages/SnapPage'
import AddSnapPage from '../pages/AddSnapPage'
import EditSnapPage from '../pages/EditSnapPage'
import ActiveSnapPage from '../pages/ActiveSnapPage'
import ActiveSnapLogsPage from '../pages/ActiveSnapLogsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ActionDefinitionPage from '../pages/ActionDefinitionPage'

// define routes
const routes = {
  '/': () => <Dashboard />,
  '/dashboard': () => <Dashboard />,
  '/active': () => <ActiveSnapsPage />,
  '/gallery': () => <GalleryPage />,
  '/mysnaps': () => <MySnapsPage />,
  '/myactions': () => <MyActionsPage />,
  '/add': () => <AddSnapPage />,
  '/logs': () => <LogsPage />,
  '/history': () => <HistoryPage />,
  '/logs/:activeSnapId': ({activeSnapId}) => <ActiveSnapLogsPage activeSnapId={activeSnapId} />,
  '/:userId/:snapId': ({userId, snapId}) => <SnapPage snapId={`${userId}/${snapId}`} />,
  '/actions/:userId/:actionId': ({userId, actionId}) => <ActionDefinitionPage actionId={`${userId}/${actionId}`} />,
  '/editor/:userId/:snapId': ({userId, snapId}) => <EditSnapPage snapId={`${userId}/${snapId}`} />,
  '/:userId/:snapId/:activeSnapId': ({userId, snapId, activeSnapId}) => <ActiveSnapPage snapId={`${userId}/${snapId}`} activeSnapId={activeSnapId} />,
};

const SnapsTab = () => {
  const { profile, storeProfile } = useProfile();

  // create state variables for current path (which determines selected tab) and expanded state
  const currentPath = window.location.pathname === '/snaps' ? 
    '/snaps/dashboard' : window.location.pathname;
  const [expanded, setExpanded] = useState(profile && profile.expanded);

  // constants that describe the top offset (to honor NavBar) and SidNav width
  const expandedWidth = 200;
  const collapsedWidth = 64;
  const topOffset = 50;

  const selectTab = (selected) => {
    navigate(`${selected}`)
  }

  const routeResult = useRoutes(routes);

  return (
    <div>  
      <div style={{
        width: expanded ? expandedWidth : collapsedWidth,
        position: 'fixed', 
        left: 0,
        top: topOffset,
        height: `calc(100vh - ${topOffset}px)`
        }}>
        <SideNav style={{ minWidth: expanded ? expandedWidth : collapsedWidth }}
          expanded={ expanded }
          onSelect={ selectTab }
          onToggle={ (expanded) => {            
            setExpanded(expanded);
            if (profile) {
              profile.expanded = expanded;
            }
            storeProfile();
          }}>
          <SideNav.Toggle />
          <SideNav.Nav selected={currentPath}>
            <NavItem eventKey="/snaps/dashboard">
              <NavIcon>
                <i className="fa fa-fw fa-tachometer" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>Dashboard</NavText>
            </NavItem>
            <NavItem eventKey="/snaps/active">
              <NavIcon>
                <i className="fa fa-fw fa-play" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>Active Snaps</NavText>
            </NavItem>
            <NavItem eventKey="/snaps/gallery">
              <NavIcon>
                <i className="fa fa-fw fa-th" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>Gallery</NavText>
            </NavItem>
            <NavItem eventKey="/snaps/mysnaps">
              <NavIcon>
                <i className="fa fa-fw fa-sitemap" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>My Snaps</NavText>
            </NavItem>
            <NavItem eventKey="/snaps/myactions">
              <NavIcon>
                <i className="fa fa-fw fa-exclamation" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>My Actions</NavText>
            </NavItem>
            <NavItem eventKey="/snaps/logs">
              <NavIcon>
                <i className="fa fa-fw fa-book" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>Logs</NavText>
            </NavItem>          
            <NavItem eventKey="/snaps/history">
              <NavIcon>
                <i className="fa fa-fw fa-bar-chart" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText" style={{ fontSize: '1.2em' }}>History</NavText>
            </NavItem>          
          </SideNav.Nav>
        </SideNav>
      </div>
      <div style={{
        position: 'relative',
        left: expanded ? expandedWidth : collapsedWidth,
        width: `calc(100vw - 20px - ${expanded ? expandedWidth : collapsedWidth }px)`,
        padding: '1px 0 0 20px',
        textAlign: 'left'
      }}>
        { routeResult || <NotFoundPage /> }
      </div>
    </div>
  )
}

export default SnapsTab
