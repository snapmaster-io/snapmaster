import React, { useState, useEffect, useCallback } from 'react'
import { useApi } from '../utils/api'
import RedirectBanner from '../components/RedirectBanner'
import ServiceDownBanner from '../components/ServiceDownBanner'
import SnapCardDeck from '../components/SnapCardDeck';

const GalleryPage = () => {
  const { get } = useApi();
  const [gallery, setGallery] = useState();
  const [loading, setLoading] = useState(true);
  const pageTitle = 'Gallery';

  // create a callback function that wraps the loadData effect
  const loadData = useCallback(() => {
    async function call() {
      setLoading(true);
      const [response, error] = await get('gallery');

      if (error || !response.ok) {
        setLoading(false);
        setGallery(null);
        return;
      }
  
      const items = await response.json();
      setLoading(false);
      setGallery(items);
    }
    call();
  }, [get]);

  // load data automatically on first page render
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if the service is down, show the banner
  if (!loading && !gallery) {
    return (
      <ServiceDownBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}/>
    )
  }

  // if there is no gallery to display, show a message instead
  if (gallery && gallery.length === 0) {
    return (
      <RedirectBanner
        loadData={loadData}
        loading={loading}
        pageTitle={pageTitle}
        messageText="No snaps in the gallery..." />
    )
  }
  
  return (
    <SnapCardDeck
      snapsData={gallery}
      pageTitle={pageTitle}
      loading={loading}
      loadData={loadData}
      />
  )
}  

export default GalleryPage