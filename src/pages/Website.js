import React from 'react'
import { useRoutes } from 'hookrouter'

// Other pages
import LandingPage from './LandingPage'
import PrivacyPage from './PrivacyPage'
import TermsPage from './TermsPage'

// define routes
const routes = {
  '/': () => <LandingPage />,
  '/privacy': () => <PrivacyPage />,
  '/terms': () => <TermsPage />,
};

const Website = () => {
  const routeResult = useRoutes(routes);
  return (routeResult || <LandingPage />)
}

export default Website
