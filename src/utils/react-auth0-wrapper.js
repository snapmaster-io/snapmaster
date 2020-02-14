// src/utils/react-auth0-wrapper.js
// REPLACED WITH LINE BELOW IT
//import React, { useState, useEffect, useContext } from "react";
import React, { useState, useEffect, useContext, useCallback } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  // ADDITION
  const [isAdmin, setIsAdmin] = useState();
  const [impersonatedUser, setImpersonatedUser] = useState();  
  // END ADDITION

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);

        // ADDITION - set the admin flag if the correct permission is in the idToken
        const permissionsScope = 'https://api.saasmaster.co/permissions';
        const impersonateUser = 'impersonate:user';
        const isAdmin = user[permissionsScope].filter(s => s === impersonateUser).length > 0;
        setIsAdmin(isAdmin);
        // END ADDITION
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  // ADDITION BY OG 1/7/2020
  // This callback wraps getTokenSilently so that it can be used in other react effects
  const getTokenSilentlyCallback = useCallback((...p) => {
    async function getToken(...p) {
      return auth0Client.getTokenSilently(...p);
    }
    return getToken();
  }, [auth0Client]);
  const logoutCallback = useCallback((...p) => {
    async function logout(...p) {
      return auth0Client.logout(...p);
    }
    return logout();
  }, [auth0Client]);
  // END ADDITION

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        // ADDITION BY OG 1/7/2020
        getTokenSilentlyCallback,
        logoutCallback,
        // END ADDITION
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
        // ADDITION
        isAdmin,
        impersonatedUser,
        setImpersonatedUser
        // END ADDITION
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};