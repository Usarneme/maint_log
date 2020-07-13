import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import Loading from '../Loading'
import { updateUserAccount } from '../../helpers'

function AccountSettings(props) {
  const [state, setState] = useState({
    name: props.user.name || '',
    email: props.user.email || '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = event => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const saveAccountChanges = async event => {
    console.log('saveAccountChanges func')
    event.preventDefault()
    setLoading(true)
    const userUpdates = { ...props.user }
    userUpdates.name = state.name
    userUpdates.email = state.email
    // TODO confirmation and password changing option
    const updates = await updateUserAccount(userUpdates)
    console.log('updateUserAccount helper returned:')
    console.log(updates)

    const updatedUser = props.user
    updatedUser.log = updates.log
    updatedUser.vehicles = updates.vehicles
    updatedUser.selectedVehicles = updates.selectedVehicles
    await props.updateUserState(updatedUser)
    toast.success('User Account Changes Saved Successfully!')
    setLoading(false)
  }

  if (loading) return <Loading message="Updating User Account..." />

  return (
    <div className="card">
      <h3>Account</h3>
      <form className="padded" onSubmit={saveAccountChanges} method="POST">
        <label htmlFor="name">Name</label>
        <input type="text" placeholder="Enter name..." name="name" value={state.name || ''} onChange={handleInputChange} />
        <label htmlFor="email">Email Address</label>
        <input type="email" placeholder="Enter email..." name="email" value={state.email || ''} onChange={handleInputChange} />
        {/* <label htmlFor="password">Password</label>
        <input type="password" placeholder="Enter password..." name="password" value={state.password || ''} onChange={handleInputChange} /> */}
        <button className="button" type="submit" >Save Account Changes</button>
      </form>
    </div>
  )
}

AccountSettings.propTypes = {
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
  // history: PropTypes.object.isRequired
}

export default AccountSettings