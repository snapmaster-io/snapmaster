import React from 'react'
import { A } from 'hookrouter'

const PageTitle = ({title}) => {
  const path = window.location.pathname;
  const components = path.split('/');
  if (components.length > 1) {
    const tabName = components[1];
    const capitalizedTabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const breadcrumb = <A href={`/${tabName}`}>{capitalizedTabName}</A>;

    return <h4 className="page-title">{breadcrumb} / {title}</h4>
  } 

  return <h4 className="page-title">{title}</h4>
}

export default PageTitle
