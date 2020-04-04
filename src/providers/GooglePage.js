import React from 'react'
import GenericProviderPage from './GenericProvider'

const GooglePage = () =>
  <GenericProviderPage 
    pageTitle='GCP Projects'
    connectionName='gcp'
    endpoint='entities/gcp:projects'
    entityName='project'
  />

export default GooglePage