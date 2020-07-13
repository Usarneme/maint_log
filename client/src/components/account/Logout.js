import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../Loading'

function Logout(props) {
  const history = useHistory()
  const [showLogoutButton, toggleShowLogoutButton] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const toggleConfirmLogout = event => {
    event.preventDefault()
    toggleShowLogoutButton(!showLogoutButton) // flip true -> false -> true...
  }

  const apiLogout = async event => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/logout`)
      if (response.status === 200) {
        props.logout()
        setLoading(false)
        toast.info('Logged Out Successfully!')        
        return history.push('/welcome')
      } else {
        const error = new Error(response.error)
        throw error
      }
    } catch(err) {
      console.error(err)
      setLoading(false)
      toast.error(err)
    }
  }

  if (isLoading) return <Loading message="Loading Logout..."/>

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