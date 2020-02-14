import React, { useState, useContext } from 'react'
import { useApi } from './api'

export const ProfileContext = React.createContext();
export const useProfile = () => useContext(ProfileContext);
export const ProfileProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const { get, post } = useApi();

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [response, error] = await get('profile');

      if (error || !response.ok) {
        setProfile(null);
        console.error(`loadProfile error: ${error}`);
      } else {
        const responseData = await response.json();
        setProfile(responseData);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(`loadProfile exception caught: ${error}`);
      setProfile(null);
      setLoading(false);
    }  
  }

  const storeProfile = async () => {
    try {
      // create a copy of the profile that only includes data that can be changed by the profile page
      const data = { 
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        skipTour: profile.skipTour,
        expanded: profile.expanded,
        notifyEmail: profile.notifyEmail,
        notifySms: profile.notifySms
      };

      // post the profile endpoint with the new profile information
      const [response, error] = await post('profile', JSON.stringify(data));

      if (error || !response.ok) {
        console.error(`storeProfile error: ${error}`);
      } 
    } catch (error) {
      console.error(`storeProfile exception caught: ${error}`);
    }  
  }

  return (
    <ProfileContext.Provider
      value={{
        loading,
        profile,
        loadProfile,
        storeProfile
      }}>
      {children}
    </ProfileContext.Provider>
  );
};