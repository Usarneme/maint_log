import React from 'react'
import PropTypes from 'prop-types'

import '../../styles/logSorter.css'

function LogSorter(props) {
  function sortBy(method, event) {
    const arrow = event.target.childNodes[1]
    // don't sort if it doesn't exist or there are 1 or 0 log entries
    if (!props || !props.user || !props.user.log || props.user.log.length <= 1) return

    if (method === 'date') {
      let tempLogArray = []
      // if they are in descending order
      if ( new Date(props.user.log[0].dateCompleted).valueOf() > new Date(props.user.log[1].dateCompleted).valueOf() ) {
        // sort log entries in ascending order
        tempLogArray = [...props.user.log].sort((first, second) => new Date(first.dateCompleted).valueOf() - new Date(second.dateCompleted).valueOf() )
        arrow.classList.remove('log__sorter__arrow__selected')
      } else {
        tempLogArray = [...props.user.log].sort((first, second) => new Date(second.dateCompleted).valueOf() - new Date(first.dateCompleted).valueOf() )
        arrow.classList.add('log__sorter__arrow__selected')
      }
      let updatedUser = {...props.user}
      updatedUser.log = tempLogArray
      props.updateUserState(updatedUser)
      return
    }

    if (method === 'service') {
      let tempLogArray = []
      // if they are not already in alphabetical order 
      if (props.user.log[0].name.localeCompare(props.user.log[1].name) > -1) {
        // sort them
        tempLogArray = [...props.user.log].sort((first, second) => first.name.localeCompare(second.name) )
        arrow.classList.add('log__sorter__arrow__selected')
      } else { // otherwise sort them in reverse alphabetical order
        tempLogArray = [...props.user.log].sort((first, second) => second.name.localeCompare(first.name) )
        arrow.classList.remove('log__sorter__arrow__selected')
      }
      let updatedUser = {...props.user}
      updatedUser.log = tempLogArray
      props.updateUserState(updatedUser)
      return
    }

    if (method === 'mileage') {
      let tempLogArray = []
      if (Number(props.user.log[0].odometer) > Number(props.user.log[1].odometer)) {
        tempLogArray = [...props.user.log].sort((first, second) => Number(first.odometer) <= Number(second.odometer) ? -1 : 1 )
        arrow.classList.remove('log__sorter__arrow__selected')
      } else {
        tempLogArray = [...props.user.log].sort((first, second) =>  Number(first.odometer) <= Number(second.odometer) ? 1 : -1 )
        arrow.classList.add('log__sorter__arrow__selected')
      }
      let updatedUser = {...props.user}
      updatedUser.log = tempLogArray
      props.updateUserState(updatedUser)
      return
    }

    if (method === 'costs') {
      let tempLogArray = []
      if ( (Number(props.user.log[0].partsCost) + Number(props.user.log[0].laborCost)) >= (Number(props.user.log[1].partsCost) + Number(props.user.log[1].laborCost))) {
        tempLogArray = [...props.user.log].sort((first, second) => (Number(first.partsCost) + Number(first.laborCost)) <= (Number(second.partsCost) + Number(second.laborCost)) ? -1 : 1 )
        arrow.classList.remove('log__sorter__arrow__selected')
      } else {
        tempLogArray = [...props.user.log].sort((first, second) => (Number(first.partsCost) + Number(first.laborCost)) <= (Number(second.partsCost) + Number(second.laborCost)) ? 1 : -1 )
        arrow.classList.add('log__sorter__arrow__selected')
      }
      let updatedUser = {...props.user}
      updatedUser.log = tempLogArray
      props.updateUserState(updatedUser)
      return
    }
  }

  return (
    <div className='log__sorter__container'>
      <div className="log__sorter__item log__sorter__service">
        <span onClick={e => sortBy('service',e)}>service <span className="log__sorter__arrow service__arrow">▴</span></span>
      </div>
      <div className="log__sorter__item log__sorter__dates">
        <span onClick={e => sortBy('date',e)}>dates <span className="log__sorter__arrow date__arrow">▴</span></span>
      </div>
      <div className="log__sorter__item log__sorter__mileage">
        <span onClick={e => sortBy('mileage',e)}>mileage <span className="log__sorter__arrow mileage__arrow">▴</span></span>
      </div>
      <div className="log__sorter__item log__sorter__costs">
        <span onClick={e => sortBy('costs',e)}>costs <span className="log__sorter__arrow costs__arrow">▴</span></span>
      </div>
    </div>
  )
}

LogSorter.propTypes = {
  user: PropTypes.shape({
    cookies: PropTypes.string,
    email: PropTypes.string,
    log: PropTypes.array,
    name: PropTypes.string,
    sessionID: PropTypes.string,
    userID: PropTypes.string,
    vehicles: PropTypes.array,
    selectedVehicles: PropTypes.array
  }),
  updateUserState: PropTypes.func.isRequired
}

export default LogSorter
