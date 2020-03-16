import React, { useState } from 'react'
import { useRoutes, navigate } from 'hookrouter'
import { useProfile } from '../utils/profile'
import './App.css'

// Top Navbar
import StickyNavbar from '../components/StickyNavbar'

// Tabs contain the complete control tree 
import SnapsTab from '../components/SnapsTab'
import ToolsTab from '../components/ToolsTab'

// Other pages
import ProfilePage from './ProfilePage'
import NotificationsPage from './NotificationsPage'
import AdminPage from './AdminPage'
import AccountSelectionPage from './AccountSelectionPage'
import TourPage from './TourPage'
import NotFoundPage from './NotFoundPage'
import ServiceDownPage from './ServiceDownPage'

// define routes
const routes = {
  '/snaps*': () => <SnapsTab />,
  '/tools*': () => <ToolsTab />,
  '/profile': () => <ProfilePage />,
  '/notifications': () => <NotificationsPage />,
  '/account': () => <AccountSelectionPage />,
  '/tour': () => <TourPage />,
  '/admin': () => <AdminPage />,
};

const App = () => {
  const { profile } = useProfile();
  // grab the current URL path and extract the active tab from the path
  const currentPath = window.location.pathname;
  const activeTab = `/${currentPath.split('/')[1]}`;
  const [state, setState] = useState( { tab: activeTab } );

  // change the state variable to match the tab extracted from the current URL path
  if (state.tab !== activeTab) {
    setState({ tab: activeTab })
  }

  const [actions] = useState({
    selectTab: (eventKey) => {
      if (!eventKey) {
        return;
      }

      const tab = eventKey.replace(/\..+/g, '');
      setState({ tab: tab });
      navigate(tab);
    }
  });

  // determine which page to route to
  const routeResult = useRoutes(routes);

  // determine page to navigate to
  if (profile && currentPath === '/') {
    // if account was not set, do so now (mandatory)
    if (!profile.account) {
      navigate('/account');
    } else {
    // redirect to snaps tab if skip tour flag is set
    if (profile.skipTour) {
        setState( { tab: '/snaps' });
        navigate('/snaps');
      } else {
        // display tour
        navigate('/tour');
      }
    }
  }

  // offset from top to honor the height of the StickyNavbar
  const topOffset = 50;

  return (
    <div>
      <StickyNavbar
        state={state}
        actions={actions}
      />
      <div style={{
        position: 'relative',
        top: topOffset,
        height: `calc(100vh - ${topOffset}px)`,
        width: '100vw'
        }}>
        { // if profile wasn't loaded, indicate the service is down
          // otherwise load the route result, and if that's empty, notfound page
          !profile ? <ServiceDownPage/> 
                   : (routeResult || <NotFoundPage />) 
        }
      </div>
  </div>
  )
}

export default App
