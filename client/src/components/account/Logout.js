import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

function Logout(props) {
  const history = useHistory()
  const [showLogoutButton, toggleShowLogoutButton] = useState(false)

  const toggleConfirmLogout = event => {
    event.preventDefault()
    toggleShowLogoutButton(!showLogoutButton) // flip true -> false -> true...
  }

  const apiLogout = async event => {
    event.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/logout`)
      if (response.status === 200) {
        props.logout()
        // logout func handles clearing state
        // props.updateUserState({ name: '', userID: '', sessionID: '', cookies: '', email: '', log: [], vehicles: [], selectedVehicles: []})
        return history.push('/welcome')
      } else {
        const error = new Error(response.error)
        throw error
      }
    } catch(err) {
      console.error(err)
      toast.error(err)
    }
  }
  return (
    <div className="card">
      <h3>Disconnect Account and Logout</h3>
      <div className="logout__container padded">
        <button className={`button ${showLogoutButton ? 'confirm--active' : 'confirm'}`} onClick={toggleConfirmLogout}>{showLogoutButton ? 'Cancel Logout' : 'Logout'}</button>
        { showLogoutButton && <button className="button disconnect" onClick={apiLogout}><span className="red">Confirm and Logout</span></button> }
      </div>
    </div>
  )
}

Logout.propTypes = {
  updateUserState: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

export default Logout