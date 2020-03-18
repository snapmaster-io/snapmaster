import React from 'react'
import { A } from 'hookrouter'

const PageTitle = ({title, usePathAsBreadcrumb, breadcrumbText, breadcrumbUrl}) => {
  // if the flag was passed as true, construct the breadcrumb from the path
  if (usePathAsBreadcrumb) {
    const path = window.location.pathname;
    const components = path.split('/');
    if (components.length > 1) {
      const tabName = components[1];
      const capitalizedTabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const breadcrumb = <A href={`/${tabName}`}>{capitalizedTabName}</A>;
      return <h4 className="page-title">{breadcrumb} / {title}</h4>
    }

    // no path to construct breadkcrumb from, so return just the title
    return <h4 className="page-title">{title}</h4>
  } 

  // if the breadcrumb properties were passed in, construct the breadcrumb from them
  if (breadcrumbText && breadcrumbUrl) {
    const breadcrumb = <A href={`${breadcrumbUrl}`}>{breadcrumbText}</A>;
    return <h4 className="page-title">{breadcrumb} / {title}</h4>  
  }

  // as a last resort, just use the title
  return <h4 className="page-title">{title}</h4>
}

export default PageTitle
