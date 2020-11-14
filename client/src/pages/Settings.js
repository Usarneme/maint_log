import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import Logout from '../components/account/Logout'
import AccountSettings from '../components/account/AccountSettings'
import ThemeSwitcher from '../components/account/ThemeSwitcher'
import VehicleSettings from '../components/vehicle/VehicleSettings'

import '../styles/settings.css'

function Settings(props) {  
  const history = useHistory()

  return (
    <div className="inner">
      <h2 className="card">Settings</h2>
      
      <div className="padded">
        <VehicleSettings 
          selectedVehicles={props.user.selectedVehicles} 
          vehicles={props.user.vehicles} 
          history={history} />
        <AccountSettings user={props.user} updateUserState={props.updateUserState} />
        <ThemeSwitcher />
        <Logout logout={props.logout} history={history} user={props.user} updateUserState={props.updateUserState} />
      </div>
    </div>
  )
}

Settings.propTypes = {
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
  updateUserState: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

export default Settings
