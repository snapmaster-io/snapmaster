import React from 'react'
import GenericProviderPage from './GenericProvider'

const DockerPage = () =>
  <GenericProviderPage 
    pageTitle='Docker Accounts'
    connectionName='docker'
    endpoint='entities/docker:accounts'
    entityName='account'
  />

export default DockerPage