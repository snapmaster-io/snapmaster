import React from 'react'
import { Jumbotron } from 'react-bootstrap'
import RefreshButton from './RefreshButton'
import PageTitle from './PageTitle'

const ServiceDownBanner = ({pageTitle, loadData, loading}) => 
  <div>
    { pageTitle !== "" &&
    <div className="page-header">
      <RefreshButton load={loadData} loading={loading}/>
      { pageTitle === 'Dashboard' ? <h4 className="page-title">{pageTitle}</h4> : <PageTitle title={pageTitle} /> }
    </div>
    }
    <Jumbotron>
      { pageTitle !== "" ? <h1 className="text-center"><i className="fa fa-frown-o"/>&nbsp;&nbsp;Can't reach service - try refreshing later</h1> 
                         : <h1 className="text-center"><i className="fa fa-frown-o"/>&nbsp;&nbsp;Can't reach service - try reloading the page</h1> 
      }
    </Jumbotron>
  </div>

export default ServiceDownBanner