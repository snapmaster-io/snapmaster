// is this a browser or mobile device
import { isBrowser, isMobile } from 'react-device-detect'

// are we in dev mode (port is 3000)
const isDevMode = new URL(window.location.origin).port > 80;

// is beta mode on
const isBeta = true;

// export all settings
export { isBrowser, isMobile, isDevMode, isBeta }
