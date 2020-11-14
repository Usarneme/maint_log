import React, { useState } from 'react'
import PropTypes from 'prop-types'

function VLManual(props) {
  const [state, setState] = useState({
    year: props.year || '',
    make: props.make || '',
    model: props.model || '',
    vin: props.vin || '',
    odometer: props.odometer || 0,
    primary: props.primary || false,
    id: props._id || '',
    owner: props.owner || ''
  })

  const handleInputChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const togglePrimary = () => { 
    setState({ ...state, primary: !state.primary })
  }

  return (
    <div className="padded form manualVehicleEntryDiv">
      <label htmlFor="year">Year</label>
      <input type="number" name="year" min="1900" step="1" value={state.year} onChange={handleInputChange} />
      <label htmlFor="make">Make </label>
      <input type="text" name="make" value={state.make} onChange={handleInputChange} />
      <label htmlFor="model">Model </label>
      <input type="text" name="model" value={state.model} onChange={handleInputChange} />
      <label htmlFor="odometer">Latest Odometer Reading</label>
      <input type="number" name="odometer" min="0" step="0.1" value={state.odometer} onChange={handleInputChange} />
      <label htmlFor="vin">VIN</label>
      <input type="text" name="vin" value={state.vin} onChange={handleInputChange} />
      <div className="checkboxes__container">
        <label htmlFor="primaryCheckbox">Main Vehicle</label>
        <input type="checkbox" name="primaryCheckbox" checked={state.primary} onChange={togglePrimary} />
      </div>
      {props.editing ?
        <button className="button" onClick={() => props.saveVehicleChanges(state)}>Save Vehicle Changes</button> :
        <button className="button" onClick={() => props.saveNewVehicle(state)}>Add Vehicle To Account</button>      
      }
    </div>
  )
}

VLManual.propTypes = {
  saveNewVehicle: PropTypes.func.isRequired,
  saveVehicleChanges: PropTypes.func,
  year: PropTypes.number,
  make: PropTypes.string,
  model: PropTypes.string,
  vin: PropTypes.string,
  odometer: PropTypes.number,
  id: PropTypes.string,
  owner: PropTypes.string,
  primary: PropTypes.bool,
  editing: PropTypes.bool // flag for new vehicle (blank form) or edit extant vehicle (fill form w/details)
}

export default VLManual