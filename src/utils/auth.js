/**
 * Check for OAuth2 redirect state and return either the provider that 
 * we just connected, or null
 * @return {String} - provider name
 */
export function connectedOAuth2Provider() {
  // if we are getting called back from an OAuth provider flow, do some cleanup
  const response = parseHash(window.location.hash)
  if (!response.providerName) {
    return null;
  }

  // clear hash 
  removeHash()

  /* Protect against csrf (cross site request forgery https://bit.ly/1V1AvZD) */
  if (response.token && !localStorage.getItem(response.csrf)) {
    // TODO: put up a proper error message
    alert('Token invalid. Please try to login again');
    return null;
  } else {
    // clean up csrfToken 
    localStorage.removeItem(response.csrf);

    // retrieve and return the provider name out of the response
    const providerName = response.providerName;
    return providerName;
  }  
}

/**
 * Generate uuid
 * @return {String} - uuidv4
 */
export function csrfToken() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8) // eslint-disable-line
    return v.toString(16)
  })
}

/**
 * Parse url hash
 * @param  {String} hash - Hash of URL
 * @return {Object} parsed key value object
 */
export function parseHash(hash) {
  if (!hash) return {}
  return hash.replace(/^#/, '').split('&').reduce((result, pair) => {
    const keyValue = pair.split('=')
    result[keyValue[0]] = decode(keyValue[1])
    return result
  }, {})
}

/**
 * Remove hash from URL
 * @return {null}
 */
export function removeHash() {
  const { history, location } = window
  document.location.hash = ''
  history.pushState("", document.title, `${location.pathname}${location.search}`)
}

function decode(s) {
  return decodeURIComponent(s).replace(/\+/g, ' ')
}
