import React from 'react'
import ReactDOM from 'react-dom'
import AppWrapper from './pages/AppWrapper'
import * as serviceWorker from './serviceWorker'

import { Auth0Provider } from './utils/react-auth0-wrapper'
import { ConnectionsProvider } from './utils/connections'
import { ProfileProvider } from './utils/profile'
import config from './utils/auth_config.json'
import { isProduction } from './utils/settings'

// import FullStory SDK
import * as FullStory from '@fullstory/browser'

// import bootstrap, font-awesome, and cloudfont CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'
import 'cloudfont/css/cloudfont.css'

// import local styles after default styles so they take precedence
import './index.css'

//import history from './utils/history'

// a function that routes the user to the right place after login
const onRedirectCallback = appState => {
  // if this login was a result of linking, then redirect to /tools/connections
  const linking = localStorage.getItem('linking');
  if (linking) {
    if (linking === 'login') {
      // completed the linking process - remove storage keys
      localStorage.removeItem('linking');
      localStorage.removeItem('primary');
      
      // get the provider and remove '-oauth2' suffix if it exists (e.g. 'google-oauth2')
      const provider = localStorage.getItem('provider');
      const providerSegment = provider && provider.split('-')[0];
      localStorage.removeItem('provider');

      // redirect to the page of the provider we just linked - this is to force the API call 
      // and bring data down to the client
      const redirectSegment = providerSegment || 'connections';

      window.history.replaceState(
        {},
        document.title,
        `${window.location.origin}/tools/${redirectSegment}`
      );
      return;
    }  
    
    window.history.replaceState(
      {},
      document.title,
      `${window.location.origin}/tools/connections`
    );
    return;
  }

  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
//      : `${window.location.pathname}/snaps/dashboard`
//      : window.location.pathname
      : `${window.location.origin}`
  );
};

// initialize FulLStory
if (isProduction) {
  FullStory.init({ orgId: 'WPR4S' });
}

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}
    onRedirectCallback={onRedirectCallback}
  >
    <ConnectionsProvider>
      <ProfileProvider>
        <AppWrapper />
      </ProfileProvider>
    </ConnectionsProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
