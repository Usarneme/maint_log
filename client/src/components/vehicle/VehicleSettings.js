import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import VLVin from './VLVin'
import VLManual from './VLManual'
import VLYMM from './VLYMM'
import Loading from '../Loading'

import UserContext from '../../contexts/UserContext'
import { addVehicle, updateVehicle } from '../../helpers'
import '../../styles/vehicle.css'

function VehicleSettings(props) {
  // console.log('loading vehicle settings with props:')
  // console.dir(props)
  const history = useHistory()
  const [vehicleLookupsShowing, showVehicleLookups] = useState(false)
  const [manualLookupShowing, showManualLookup] = useState(false)
  const [vinLookupShowing, showVinLookup] = useState(false)
  const [yearMakeModelLookupShowing, showYearMakeModelLookup] = useState(false)
  // dictionary of shape { vehicleID : Boolean } for if that vehicle ID is being edited currently
  // this controls whether the edit vehicle (VLManual component) is loaded for that vehicle 
  const [vehiclesEditing, changeVehicleEditStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const {user, updateUserState} = useContext(UserContext)

  useEffect(() => {
    if (props.vehicles && props.vehicles.length > 0) {
      let transform = {}
      props.vehicles.forEach(vehicle => {
        transform[vehicle._id] = false 
      })
      // console.log('component mounting, initializing state for whether each individual vehicle is being edited or not') 
      // console.log(transform)
      if (Object.keys(vehiclesEditing).length === 0) changeVehicleEditStatus({...transform})
    }
  }, [props.vehicles, vehiclesEditing])
  
  const vehicleLookupChanger = view => {
    showVehicleLookups(true)
    showVinLookup(false)
    showManualLookup(false)
    showYearMakeModelLookup(false)
    // view useState toggles: showYearMakeModelLookup, showVinLookup, or showManualLookup
    // [view](true) -- TODO make this dynamic function call work instead of the switch...
    switch (view) {
      case 'showVinLookup': 
        showVinLookup(true)
        break
      case 'showManualLookup': 
        showManualLookup(true)
        break
      case 'showYearMakeModelLookup': 
        showYearMakeModelLookup(true)
        break
      default: showYearMakeModelLookup(true)
    }
  }

  const saveNewVehicle = async vehicle => {
    setLoading(true)
    // ensure even optional properties are sent to the server/db
    vehicle.make = vehicle.make || ''
    vehicle.model = vehicle.model || ''
    vehicle.odometer = vehicle.odometer || 0
    vehicle.vin = vehicle.vin || ''
    vehicle.year = vehicle.year || ''
    vehicle.primary = vehicle.primary || false
    // ensure unnecessary state items are not passed to the server/db
    delete vehicle.models // from year+make+model vehicle lookup
    delete vehicle.showConfirmButton // from year+make+model vehicle lookup

    // console.log('Save New Vehicle in VehicleSettings. Adding vehicle:')
    // console.dir(vehicle)
    const newLogVehicleArrays = await addVehicle(vehicle)
    // console.log('returned to saveNewVehicle in VehicleSettings')
    // console.log(newLogVehicleArrays)
    const newUser = {...user, log: newLogVehicleArrays.log, vehicles: newLogVehicleArrays.vehicles}
    await updateUserState({ ...newUser })
    showVehicleLookups(false)
    setLoading(false)  
  }

  const saveVehicleChanges = async vehicle => {
    // console.log('saveVehicleChanges called from VehicleSettings component')
    // console.log(vehicle)
    if (!vehicle || !vehicle.id || !vehicle.owner) return new Error('Problem updating vehicle. Please try again.')
    setLoading(true)
    // ensure even optional properties are sent to the server/db
    vehicle.make = vehicle.make || ''
    vehicle.model = vehicle.model || ''
    vehicle.odometer = vehicle.odometer || 0
    vehicle.vin = vehicle.vin || ''
    vehicle.year = vehicle.year || ''
    vehicle.primary = vehicle.primary || false
    vehicle._id = vehicle.id

    // set state to no longer be editing this vehicle after saving updates
    changeVehicleEditStatus({ ...vehiclesEditing, [vehicle._id]: !vehiclesEditing[vehicle._id] })
    const newLogVehicleArrays = await updateVehicle(vehicle)
    // console.log('sent changes to server. results: ')
    // console.log(newLogVehicleArrays)
    const newUser = {...user, log: newLogVehicleArrays.log, vehicles: newLogVehicleArrays.vehicles}
    await updateUserState({ ...newUser })
    showVehicleLookups(false)
    setLoading(false)
  }

  const deleteVehicle = async vehicleId => {
    if (!vehicleId) return toast.error('Unable to locate vehicle ID. Please try again.')
    setLoading(true)
    console.log('Deleting vehicle: '+vehicleId)
    // DOMAIN/api/delete/vehicle/:vehicleId
    const url = `${process.env.REACT_APP_API_DOMAIN}/api/delete/vehicle/${vehicleId}`
    try {
      const result = await axios.post(url)
      // console.log('got results from delete vehicle post:')
      // console.dir(result)
      if (result.status === 200) {
        // update State to remove the deleted entry
        const newVehicleList = user.vehicles.filter(vehicle => vehicle._id !== vehicleId)
        // console.log('Purged deleted vehicle. New vehicle list: ')
        // console.log(newVehicleList)
        delete user.vehicles
        user.vehicles = [...newVehicleList]
        await updateUserState(user)
        setLoading(false)
        return history.push(`/settings`)
      }
    } catch(err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading/Updating Vehicle Settings..." />

  return (
    <div className="card">
      <h3>{`Vehicle${(props.vehicles && props.vehicles.length) > 1 ? "s": ""}`}</h3>
      <div>
      { (props.vehicles && props.vehicles.length > 0) && props.vehicles.map(vehicle => {
          return (
            <div key={vehicle._id} className={`${vehicle.primary ? 'vehicle__container padded primary' : 'vehicle__container padded'}`} >
              <h4>{vehicle.year}&nbsp;{vehicle.make}&nbsp;{vehicle.model}</h4>
              <div className="card vehicle__editor">
                <button 
                  className={vehiclesEditing[vehicle._id] ? `button warn` : `button`} 
                  onClick={() => changeVehicleEditStatus({ ...vehiclesEditing, [vehicle._id]: !vehiclesEditing[vehicle._id] }) } >
                    { vehiclesEditing[vehicle._id] ? `Close Editor Without Saving` : `Edit` }
                </button>
                { vehiclesEditing[vehicle._id] && 
                <>
                  <VLManual {...vehicle} saveNewVehicle={saveNewVehicle} saveVehicleChanges={saveVehicleChanges} editing={true} /> 
                  <button className="button delete delete__vehicle" onClick={() => deleteVehicle(vehicle._id)}>Permanently Delete Vehicle</button>
                </>
                }
              </div>
            </div>
          )
        }) 
      }
      </div>
      <div className="add__vehicle__container padded">
        { vehicleLookupsShowing && 
          <>
            <div className="buttons__holder">
              <button className="button" onClick={() => showVehicleLookups(false)} >Hide Vehicle Search</button>
            </div>
            <div className="buttons__holder">
              <span>Find Vehicle By:</span>
              <button className={`lookup__button ${yearMakeModelLookupShowing ? 'lookup__selected' : ''}`} onClick={() => vehicleLookupChanger('showYearMakeModelLookup')}>Make &amp; Model</button>
              <button className={`lookup__button ${vinLookupShowing ? 'lookup__selected' : ''}`} onClick={() => vehicleLookupChanger('showVinLookup')}>VIN</button>
              <button className={`lookup__button ${manualLookupShowing ? 'lookup__selected' : ''}`} onClick={() => vehicleLookupChanger('showManualLookup')}>Manually Enter</button>
            </div>
            <div className="lookupSwitcher">
              { vinLookupShowing && <VLVin currentVehicle={(props.selectedVehicles && props.selectedVehicles.length > 0 && props.selectedVehicles[0]) || {}} saveNewVehicle={saveNewVehicle} /> }
              { yearMakeModelLookupShowing && <VLYMM currentVehicle={(props.selectedVehicles && props.selectedVehicles.length > 0 && props.selectedVehicles[0]) || {}} saveNewVehicle={saveNewVehicle} /> }
              { manualLookupShowing && <VLManual saveNewVehicle={saveNewVehicle} saveVehicleChanges={saveVehicleChanges} /> }
            </div>
          </> }
          
        { !vehicleLookupsShowing && 
            <div className="buttons__holder">
              <button className="button" onClick={() => showVehicleLookups(true)} >Add A New Vehicle</button>
            </div>
        }
      </div>
    </div>
  )
}

VehicleSettings.propTypes = {
  vehicles: PropTypes.array.isRequired,
  selectedVehicles: PropTypes.array
}

export default VehicleSettings