import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/vehicle.css'

function VehiclesSelector(props) {
  console.log('Vehicle selector component with props: ')
  console.dir(props)
  return (
    <div className="card vehicles__selector vehicles">
      <div>
        <h4 className="flexy vehicles__selector__header">
          <span>Your Vehicles</span> 
          <span>Selected for View</span>
        </h4>
      </div>
      { (!props.allVehicles || props.allVehicles.length === 0) && <span>(none)</span> }
      { props.allVehicles && props.allVehicles.length > 0 && props.allVehicles.map(vehicle => {
        return (
          <div key={vehicle.id} className="well vehicle">
            <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>
            <input type="checkbox" checked={props.vehiclesShowing.includes(vehicle.id)} name={vehicle.id} onChange={props.changeVehiclesShowing} /> 
          </div>
        )
      }) }
    </div>
  )
}

VehiclesSelector.propTypes = {
  allVehicles: PropTypes.array.isRequired, // an array of all vehicle data { id, year, make model etc }
  vehiclesShowing: PropTypes.array.isRequired, // an array[] of 0+ vehicle IDs that are currently selected for viewing
  changeVehiclesShowing: PropTypes.func.isRequired // Log and Todo pages use this to render entries based on selected vehicles
}

export default VehiclesSelector
