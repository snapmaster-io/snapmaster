import React from 'react'
import { useConnections } from '../utils/connections'
import { providerTitle } from '../utils/strings'
import ProviderDefinition from '../components/ProviderDefinition/ProviderDefinition'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import ServiceDownBanner from '../components/ServiceDownBanner'
import ConnectButton from '../components/ConnectButton'

const ProviderDefinitionPage = ({provider}) => {
  const { loading, loadConnections, connections } = useConnections();
  const pageTitle = provider && provider.title && providerTitle(provider.title);

  // if in the middle of a loading loop, put up loading banner and bail
  if (!connections && loading) {
    return <Loading />
  }

  if (!loading && (!connections || !connections.length)) {
    return (
      <ServiceDownBanner
        loadData={loadConnections}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <div style = {{ minWidth: 230 }}>
          <PageTitle usePathAsBreadcrumb title={pageTitle} />
        </div>
        <div style={{ marginLeft: 50 }}>
          <ConnectButton tool={provider} />
        </div>
      </div>
      <ProviderDefinition provider={provider} />
    </div>
  )
}

export default ProviderDefinitionPage

