import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'
import { useProfile } from '../utils/profile'
import { useConnections } from '../utils/connections'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import ConnectionsPage from '../pages/ConnectionsPage'
import LibraryPage from '../pages/LibraryPage'
import NotFoundPage from '../pages/NotFoundPage'

// define routes
const routes = {
  '/': () => <LibraryPage />,
  '/library': () => <LibraryPage />,
  '/connections': () => <ConnectionsPage />,
};

const ToolsTab = () => {
  const { profile, storeProfile } = useProfile();
  const { connections } = useConnections();

  // create state variables for current path (which determines selected tab) and expanded state
  const currentPath = window.location.pathname;
  const [expanded, setExpanded] = useState(profile && profile.expanded);

  // constants that describe the top offset (to honor NavBar) and SidNav width
  const expandedWidth = 200;
  const collapsedWidth = 64;
  const topOffset = 50;

  const selectTab = (selected) => {
    navigate(`${selected}`)
  }

  useRedirect('/', '/tools/library');
  const routeResult = useRoutes(routes);

  // create an array containing the names of all the tools tabs that are connected and should be displayed
  const sideNavTabs = connections.filter(c => c.connected !== null).map(c => c.provider.split('-')[0]);

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
          <NavItem eventKey="/tools/library">
              <NavIcon>
                <i className="fa fa-fw fa-university" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Library</NavText>
            </NavItem>
            <NavItem eventKey="/tools/connections">
              <NavIcon>
                <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Connections</NavText>
            </NavItem>
            {
              sideNavTabs.map(c => 
                <NavItem key={c} eventKey={`/tools/${c}`}>
                  <NavIcon>
                    <i className={`fa fa-fw fa-${c}`} style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText style={{ fontSize: '1.2em' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</NavText>
                </NavItem>
              )
            }
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

export default ToolsTab