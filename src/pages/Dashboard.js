import React, { useState, useCallback, useEffect } from 'react'
import { useApi } from '../utils/api'
import { useConnections } from '../utils/connections'
import { calculateStringLength } from '../utils/strings'
import { CardDeck } from 'react-bootstrap'
import RefreshButton from '../components/RefreshButton'
import RedirectBanner from '../components/RedirectBanner'
import DashboardCard from '../components/DashboardCard';

const Dashboard = () => {
  const { connections } = useConnections();
  const { get } = useApi();
  const [activeSnaps, setActiveSnaps] = useState();
  const [loading, setLoading] = useState(false);
  const pageTitle = 'Dashboard';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('activesnaps');

      if (error || !response.ok) {
        setActiveSnaps(null);
        setLoading(false);
        return;
      }
  
      const item = await response.json();      
      if (item && !item.error && item.data) {
        setActiveSnaps(item.data);
      } 
      
      setLoading(false);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // get some of the core dashboard metrics
  const connectedToolsCount = connections && connections.filter(c => c.connected).length;
  const disconnectedToolsCount = connections && connections.length - connectedToolsCount;
  const activeSnapCount = activeSnaps && activeSnaps.length;
  const activatedSnapCount = activeSnaps && activeSnaps.filter(c => c.state === 'active').length;
  const pausedSnapCount = activeSnaps && activeSnapCount - activatedSnapCount;

  // if no tools connected, return a banner to connect tools
  if (connectedToolsCount === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No tools connected yet..."
        redirectUrl="/tools/library"
        anchorText="Library"
        redirectText="to find and connect tools!" />
    )
  }

  // if no active snaps, return a banner to activate snaps
  if (activeSnaps && activeSnapCount === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No active snaps yet..."
        redirectUrl="/snaps/gallery"
        anchorText="Gallery"
        redirectText="to find and activate snaps!" />
    )
  }

  const executionCount = activeSnaps && activeSnaps
    .map(a => a.executionCounter ? a.executionCounter : 0)
    .reduce((a, b) => a + b, 0);

  const errorCount = activeSnaps && activeSnaps
    .map(a => a.errorCounter ? a.errorCounter : 0)
    .reduce((a, b) => a + b, 0);

  // get snaps for top 3 executions
  const topSnaps = activeSnaps && activeSnaps
    .map(a => { return { activeSnapId: a.activeSnapId, snapId: a.snapId, executionCounter: a.executionCounter || 0 } })
    .slice()
    .sort((a, b) => {
      if (a.executionCounter > b.executionCounter) return -1;
      if (b.executionCounter > a.executionCounter) return 1;
      return 0;
    })
    .slice(0, 3);

  const topSnap = topSnaps && topSnaps[0].snapId;
  const stringLen = topSnap && calculateStringLength(topSnap, 350);
  const topSnapName = topSnap && (stringLen < topSnap.length ? topSnap.slice(0, stringLen) + '...' : topSnap);

  const createTitle = (icon, style, text) => 
    <span>
      <i className={`fa fa-${icon} fa-2x text-${style}`} style={{ fontSize: '1.2em' }} />
      &nbsp;&nbsp;&nbsp;{text}
    </span>

  const dashboardCards = [{
    title: createTitle('play', 'success', 'Active Snaps'),
    url: '/snaps/active',
    value: activatedSnapCount,
    border: 'success',
    color: '#28a745'
  }, {
    title: createTitle('pause', 'warning', 'Paused Snaps'),
    url: '/snaps/active',
    value: pausedSnapCount,
    border: 'warning',
    color: '#ffc107'
  }, {
    title: createTitle('play', 'success', 'Connected Tools'),
    url: '/tools/connections',
    value: connectedToolsCount ,
    border: 'success',
    color: '#28a745'
  }, {
    title: createTitle('times', 'danger', 'Not Connected'),
    url: '/tools/library',
    value: disconnectedToolsCount,
    border: 'danger',
    color: '#dc3545'
  }, {
    title: createTitle('play', 'success', 'Snap Executions'),
    url: '/snaps/logs',
    value: executionCount,
    border: 'success',
    color: '#28a745'
  }, {
    title: createTitle('times', 'danger', 'Execution Errors'),
    url: '/snaps/logs',
    value: errorCount,
    border: 'danger',
    color: '#dc3545'
  }, {
    title: createTitle('', '', 'Top Snap'),
    url: topSnaps && `/snaps/${topSnaps[0].snapId}/${topSnaps[0].activeSnapId}`,
    label: topSnaps && <h5 style={{ color: 'gray' }}>{topSnapName}</h5>,
    value: topSnaps && topSnaps[0].executionCounter,
  }];

  return (
    <div>
      <div className="page-header">
        <RefreshButton load={loadData} loading={loading}/>
        <h4 className="page-title">{pageTitle}</h4>
      </div>
      { activeSnapCount > 0 && 
        <CardDeck style={{padding: 25}}>
        {
          dashboardCards && dashboardCards.map((c, key) => 
            <DashboardCard 
              key={key}
              title={c.title}
              url={c.url}
              border={c.border}
              color={c.color}
              label={c.label}
              value={c.value}
            />
          )  
        }
        </CardDeck>
      }      
    </div>
  )
}

export default Dashboard

