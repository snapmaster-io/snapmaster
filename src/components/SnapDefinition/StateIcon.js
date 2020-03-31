import React from 'react'

const StateIcon = ({state}) => {
  const icons = {
    active: 'fa fa-play text-success',
    paused: 'fa fa-pause text-warning',
    none: 'fa fa-play text-muted'
  }
  const stateFormatter = (state) => <i className={icons[state]} style={{ fontSize: '6em', margin: 50 }} />
  return state ? stateFormatter(state) : stateFormatter('none');
}

export default StateIcon
