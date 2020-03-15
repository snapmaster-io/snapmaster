import React from 'react'
import { Jumbotron } from 'react-bootstrap'
import { A } from 'hookrouter'
import RefreshButton from './RefreshButton'
import PageTitle from './PageTitle'

const RedirectBanner = ({pageTitle, loadData, loading, messageText, redirectUrl, anchorText, redirectText}) => 
  <div>
    <div className="page-header">
      <RefreshButton load={loadData} loading={loading}/>
      { pageTitle === 'Dashboard' ? <h4 className="page-title">{pageTitle}</h4> : <PageTitle title={pageTitle} /> }
    </div>
    <Jumbotron>
      <h1 className="text-center">{messageText}</h1>
      { redirectUrl && anchorText && redirectText &&
      <div>
        <br />
        <h3 className="text-center">Browse the <A href={redirectUrl}>{anchorText}</A> {redirectText}</h3>
        <br />
      </div>
      }
    </Jumbotron>
  </div>

export default RedirectBanner