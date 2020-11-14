import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import VehiclesSelector from '../components/vehicle/VehiclesSelector'
import LogEntry from '../components/log/LogEntry'
import LogSorter from '../components/log/LogSorter'

function Todo(props) {
  const [vehiclesShowing, changeVehiclesShowing] = useState([])
  const [entriesShowing, changeEntriesShowing] = useState([])
  
  // at initial mount, setup data for rendering
  useEffect(() => {
    // Defaults to the currently selectedVehicle(s) ID(s) if any, OR
    // Defaults to all ID(s) in the user's vehicles array
    const veh = []
    if (props.user.selectedVehicles.length > 0) { 
      props.user.selectedVehicles.forEach(vehicle => {
        if (vehicle !== undefined && vehicle.id) veh.push(vehicle.id)
      })
    } else if (props.user.vehicles.length > 0) {
      props.user.vehicles.forEach(vehicle => {
        if (vehicle !== undefined && vehicle.id) veh.push(vehicle.id)
      })
    }
    changeVehiclesShowing([...veh])

    const ent = props.user.log.filter(logEntry => {
      // each log entry has a:
      // "vehicle" field which holds the String ID of the vehicle for this service
      // "mileageDue" field which is an optional future odometer number at which the service repeats
      // "dateDue" field which is an optional future date at which the service repeats
      if (veh.includes(logEntry.vehicle) && (logEntry.mileageDue !== null || logEntry.dateDue !== null)) {
        return logEntry
      }
    })
    changeEntriesShowing(ent)
  }, []) // empty [] only runs this at initial startup, prevents infinite re-render loop
  
  const changeVehicleStatus = event => {
    const clickedOnVehicleId = event.target.name
    let vehicleUpdates = []
    // if it is already in the list, remove it
    if (vehiclesShowing.includes(clickedOnVehicleId)) {
      vehicleUpdates = vehiclesShowing.filter(vehicleId => vehicleId !== clickedOnVehicleId)
    } else { // if it was not in the list, add it
      vehicleUpdates = vehiclesShowing
      vehicleUpdates.push(clickedOnVehicleId)
    }
    changeVehiclesShowing(vehicleUpdates)
    const logUpdates = props.user.log.filter(logEntry => {
      if (vehicleUpdates.includes(logEntry.vehicle) && (logEntry.mileageDue !== null || logEntry.dateDue !== null)) {
        return logEntry
      }
    })
    changeEntriesShowing(logUpdates)
  }

  return (
    <div className="inner">
      <h2 className="card">Upcoming Service{Object.keys(entriesShowing).length > 1 ? 's': ''}</h2>
      <VehiclesSelector allVehicles={props.user.vehicles} vehiclesShowing={vehiclesShowing} changeVehiclesShowing={changeVehicleStatus} />
      { entriesShowing.length === 0 &&
        <div className="card no__todos padded">
          <h3>No Future-Due Log Entries Found!</h3>
        <div>
            <p className="padded">No log entries for the vehicles selected. Please select more vehicles or add a new entry.</p>
          </div>
          <Link className="button" to="/add">Add A Log Entry Now</Link>
          <Link className="button" to="/log">Review Your Log</Link>
        </div>
      }
      { entriesShowing.length > 0 &&
        <div className="card padded">
          <LogSorter {...props} />
          {entriesShowing && entriesShowing.map(entry => <LogEntry key={entry._id} data={entry} />)}
        </div>
      }
    </div>
  )
}

Todo.propTypes = {
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
}

export default Todo