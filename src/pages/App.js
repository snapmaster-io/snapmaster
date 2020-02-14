import React, { useState } from 'react'
import { useRoutes, navigate } from 'hookrouter'
import { useProfile } from '../utils/profile'
import './App.css'

// Top Navbar
import StickyNavbar from '../components/StickyNavbar'

// Tabs contain the complete control tree 
import ReputationTab from '../components/ReputationTab'
import SourcesTab from '../components/SourcesTab'

// Other pages
import ProfilePage from './ProfilePage'
import NotificationsPage from './NotificationsPage'
import AdminPage from './AdminPage'
import TourPage from './TourPage'
import NotFoundPage from './NotFoundPage'
import ServiceDownPage from './ServiceDownPage'

// define routes
const routes = {
  '/reputation*': () => <ReputationTab />,
  '/sources*': () => <SourcesTab />,
  '/profile': () => <ProfilePage />,
  '/notifications': () => <NotificationsPage />,
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

  // redirect to reputation tab if skip tour flag is set
  if (profile && currentPath === '/') {
    if (profile.skipTour) {
      setState( { tab: '/reputation' });
      navigate('/reputation')
    } else {
      navigate('/tour')
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
