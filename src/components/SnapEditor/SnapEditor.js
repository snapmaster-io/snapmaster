import React from 'react'
import EditableProviderCard from './EditableProviderCard'
import ParamsEditor from './ParamsEditor'
import { CardDeck } from 'react-bootstrap'

const SnapEditor = ({snap, setSnap}) => {
  // get the trigger config section
  const trigger = snap && snap.config && snap.config.find(c => c.name === snap.trigger);

  // construct array of action provider names
  const actionList = snap && snap.actions && snap.actions.map(action => {
    const actionConfig = snap.config && snap.config.find(c => c !== null && c.name === action);
    return actionConfig;
  }).filter(a => a !== undefined);

  // initialize parameters
  if (snap && !snap.parameters) {
    snap.parameters = [];
  }

  const setConfig = (config) => {
    // find the index of the config entry being mutated
    const index = snap.config.findIndex(c => c.name === config.name);

    // if not found, create a new config entry
    if (index === -1) {
      snap.config.push({ ...config });
      snap.actions.push(config.name);
    } else {
      // check for deleting the current config entry
      if (config.delete) {
        // remove the current action from action list and config
        const actionIndex = snap.actions.indexOf(config.name);
        snap.actions.splice(actionIndex, 1);
        snap.config.splice(index, 1);
      } else {
        // replace the config entry with the new one
        snap.config[index] = config;
      }
    }

    // create any new parameters
    const regex = /\$[a-zA-Z][a-zA-Z0-9-]*/g;
    for (const entry of snap.config) {
      for (const key of Object.keys(entry)) {
        // match the parameter value against the $param regex
        const matches = entry[key] && entry[key].match && entry[key].match(regex);
        if (matches) {
          for (const match of matches) {
            // get the parameter name without the leading "$"
            const paramName = match.slice(1, match.length);

            // if the parameter doesn't already exist, add it
            if (snap.parameters && !snap.parameters.find(p => p.name === paramName)) {
              snap.parameters.push({ name: paramName });
            }
          }
        }
      }
    }

    // remove empty fields from parameters 
    if (snap.parameters) {
      for (const param of snap.parameters) {
        if (param.description === "") {
          delete param.description;
        }
        if (param.entity === "") {
          delete param.entity;
        }
      }
    }

    // store the snap
    setSnap({ ...snap });
  }

  const changeParams = () => {
    // remove empty fields
    for (const param of snap.parameters) {
      if (param.description === "") {
        delete param.description;
      }
      if (param.entity === "") {
        delete param.entity;
      }
    }
    // store the snap
    setSnap({ ...snap });
  }

  return (
    <div>
      <CardDeck>
        { trigger && <EditableProviderCard config={trigger} setConfig={setConfig} role="triggers" opname="event" /> }
        { trigger && <i className="fa fa-play text-muted" style={{ fontSize: '6em', margin: 50 }} /> }
        { actionList && actionList.map(a => <EditableProviderCard key={`${a.provider}:${a.action}`} config={a} setConfig={setConfig} role="actions" opname="action" />) }
        <EditableProviderCard role="actions" opname="action" setConfig={setConfig} />
      </CardDeck>
      <div>
        <hr />
        <ParamsEditor params={snap && snap.parameters} setParams={changeParams} />
      </div>
    </div>
  )
}

export default SnapEditor