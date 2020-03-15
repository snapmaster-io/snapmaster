import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { navigate } from 'hookrouter'
import { Button } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import PageTitle from '../components/PageTitle'
import DataTable from '../components/DataTable'
import SnapCard from '../components/SnapCard'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'

const MySnapsPage = () => {
  const { get, post } = useApi();
  const { user } = useAuth0();
  const [mySnaps, setMySnaps] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'My Snaps';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('snaps');

      if (error || !response.ok) {
        setLoading(false);
        setMySnaps(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setMySnaps(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !mySnaps) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if no tools connected, return a banner to connect tools
  if (mySnaps && mySnaps.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="You don't have any snaps yet..."
        redirectUrl="/snaps/gallery"
        anchorText="Gallery"
        redirectText="to fork your own snaps!" />
    )
  }
  /* You don't have any snaps yet.  Create a new snap or fork one from the Gallery :) */

  const urlFormatter = (cell, row) => {
    if (row.url) {
      return <a href={row.url} target="_">{cell}</a>
    } else {
      return (
        <Button onClick={ () => { navigate(`/snaps/${row.userId}/${row.name}`) }}>
          {`View definition`} 
        </Button>
      )
    }
  }

  const deleteFormatter = (cell, row) => {
    return (
      <Button className="btn btn-danger" onClick={ () => handleDelete(row.snapId)}>
        <i className="fa fa-remove" />&nbsp;&nbsp;Delete
      </Button>
    )
  }

  const handleDelete = async (snapId) => {
    // post the delete request to the snaps endpoint
    const request = {
      action: 'delete',
      snapId: snapId
    };

    const [response, error] = await post('snaps', JSON.stringify(request));
    if (error || !response.ok) {
      return;
    }

    const newSnaps = mySnaps.filter(a => a.snapId !== snapId);
    setMySnaps(newSnaps);
  }

  const dataRows = mySnaps && mySnaps.map(s => {
    const userId = s.snapId.split('/')[0];
    const name = s.snapId.split('/')[1];
    return {
      snapId: s.snapId,
      userId: userId,
      name: name,
      provider: s.provider,
      actions: s.actions,
      config: s.config,
      url: s.url,
      private: s.private,
    }
  });

  const columns = [{
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '250px' };
    }
  }, {
    dataField: 'private',
    text: 'Private?',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    },
  }, {
    dataField: 'url',
    text: 'Definition',
    formatter: urlFormatter
  }, {
    dataField: 'snapId',
    text: 'Actions',
    formatter: deleteFormatter
  }];  
  
  return(
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <PageTitle title={pageTitle} />
      </div>

      { mySnaps && 
        dataRows.map(snap => <SnapCard key={snap.snapId} snap={snap} currentUser={user.sub} />)
        /*<DataTable 
          columns={columns} 
          data={dataRows} 
          keyField='snapId' />*/
      }
    </div>
  )
}

export default MySnapsPage