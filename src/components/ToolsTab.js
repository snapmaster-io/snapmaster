import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'
import { useProfile } from '../utils/profile'
import { useConnections } from '../utils/connections'
import { providerTitle } from '../utils/strings'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import ConnectionsPage from '../pages/ConnectionsPage'
import LibraryPage from '../pages/LibraryPage'
import ProviderDefinitionPage from '../pages/ProviderDefinitionPage'
import ProviderPage from '../pages/ProviderPage'
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

  // get the connected providers
  const connectedProviders = connections.filter(c => c.connected !== null);

  // create an array containing the names of all the tools tabs that are connected and should be displayed
  const sideNavTabs = connectedProviders.map(c => c.title);

  // add routes for all connected providers
  for (const p of connectedProviders) {
    routes[`/${p.title}`] = () =>
      <ProviderPage provider={p} />
  }

  // add routes for all provider details pages
  for (const p of connections) {
    routes[`/${p.title}/definition`] = () =>
      <ProviderDefinitionPage provider={p} />
  }

  // compute the route result
  useRedirect('/', '/tools/library');
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
            <NavItem eventKey="/tools/library">
              <NavIcon>
                <i className="fa fa-fw fa-university" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Library</NavText>
            </NavItem>
            <NavItem eventKey="/tools/connections">
              <NavIcon>
                <i className="fa fa-fw fa-usb" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Connections</NavText>
            </NavItem>
            {
              sideNavTabs.map(c => 
                <NavItem key={c} eventKey={`/tools/${c}`}>
                  <NavIcon>
                    <i className={`cloudfont-${c}`} style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText style={{ fontSize: '1.2em' }}>{providerTitle(c)}</NavText>
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