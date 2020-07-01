import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import ForgotPassword from './ForgotPassword'
import Loading from '../Loading'
import { apiLogin } from '../../helpers'
import '../../styles/login.css'

function Login(props) {
  const history = useHistory()
  const [state, setState] = useState({
    email: '',
    password: '',
    persist: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // if they checked the box to have their username remembered...
    const email = localStorage.getItem('maint_log_email')
    if (email && email.length > 0) {
      setState({
        ...state, email: email, persist: true
      })
    }
  }, []) // only run at initial page load

  const handleInputChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const handlePersistCheckboxChange = event => {
    if (!state.persist && state.email) {
      localStorage.setItem('maint_log_user', state.email)
    } else {
      localStorage.removeItem('maint_log_user')
    }
    setState({ ...state, persist: !state.persist })
  }

  const handleLogin = async event => {
    event.preventDefault()
    const { email, password } = state
    setLoading(true)
    // login func already wrapped in a try/catch. returns an error in result[response] if there is a failure
    const result = await apiLogin(email, password)
    if (!result || result.response !== undefined) {
      setLoading(false)
      return alert(`Error logging in. Please try again. Status ${result.response.status}: ${result.response.statusText}.`)
    }
    const { user } = result
    console.log('Server returned user:')
    console.log(user)

    if (Object.keys(user).length === 0) {
      return alert('Server could not locate that user. Please try again.')
    }
    if (!user.selectedVehicles || user.selectedVehicles === undefined) user.selectedVehicles = []
    await props.login(user)
    setLoading(false)
    console.log('Loading set to false in Login component. Pushing history to /')
    return history.push('/')
  }

  if (loading) return <Loading message="Logging in..." messages={["Logging in..."] } /> 

  return (
    <div className="card">
      <h3>Login</h3>
      <form className="padded" onSubmit={handleLogin} method="POST">
        <label htmlFor="email">Email Address</label>
        <input type="email" name="email" placeholder="Enter email..." value={state.email || ''} onChange={handleInputChange} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter password..." value={state.password || ''} onChange={handleInputChange} />
        <button className="button" type="submit" >Log In →</button>
        <div className="remember_box">
          <label htmlFor="persist">Remember me</label>
          <input type="checkbox" name="persist" checked={state.persist} onChange={handlePersistCheckboxChange} /> 
        </div>
      </form>

      <ForgotPassword email={state.email || ''} /> 
    </div>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}

export default Login
