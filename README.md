![SnapMaster](public/SnapMaster-logo-220.png)
# SnapMaster 
## Master your DevOps toolchain

SnapMaster is the definitive DevOps integration platform.  

SnapMaster is a [React](https://reactjs.org) app, and this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Implementation notes

SnapMaster is a single-page app that works against [SnapMaster-API](https://github.com/ogazitt/snapmaster-api) as a back-end.  

SnapMaster uses [Auth0](https://auth0.com) for its authentication and authorization.

## Source directory structure

### `public`
Contains `index.html` and public assets

### `src`
####   `components`: Reusable react components
####   `pages`: Pages constructed using components
####   `providers`: Pages for each social media provider, using BaseProvider as a common base
####   `utils`: Common utilities

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

You need to run the [SnapMaster-API](https://github.com/ogazitt/snapmaster-api) back-end to have the SPA function correctly.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.