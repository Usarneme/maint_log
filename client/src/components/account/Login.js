import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

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
    const email = localStorage.getItem('maint_log_username')
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

  // Called whenever there is a change in the checkbox state
  const handlePersistCheckboxChange = event => {
    // if persist is unchecked/false when they click then they just toggled it to checked/true 
    // thus we save the email address to storage
    if (!state.persist && state.email) {
      localStorage.setItem('maint_log_username', state.email)
    } else {
      localStorage.removeItem('maint_log_username')
    }
    setState({ ...state, persist: !state.persist })
  }

  // Called each time when leaving (onBlur) the email field
  const checkAndSave = event => {
    if (state.persist && state.email) {
      localStorage.setItem('maint_log_username', state.email)
    }
  }

  const validation = () => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const validEmailShape = emailRegex.test(String(state.email).toLowerCase())
    if (!state.email || state.email.length <= 0 || !validEmailShape) {
      const message = "Please first type in a valid email address."
      return {valid: false, message}
    }

    if (!state.password || state.password.length <= 0) {
      const message = "Please enter a password."
      return {valid: false, message}
    }

    const message = "Validation Passed"
    return {valid: true, message}
  }

  const handleLogin = async event => {
    event.preventDefault()

    const validationResult = validation()
    if (validationResult.valid !== true) {
      setLoading(false)
      toast.error(validationResult.message)
      return
    }

    const { email, password } = state
    setLoading(true)
    // Save email for next time login
    if (state.persist && state.email) {
      localStorage.setItem('maint_log_username', state.email)
    }
    // login func already wrapped in a try/catch. returns an error in result[response] if there is a failure
    const result = await apiLogin(email, password)
    console.log('login component, apiLogin call returned: ')
    console.log(result)
    if (!result || result.isError === true) {
      setLoading(false)
      toast.error(result.message || 'Problem logging in. Please try again.')
      return
    }
    // if we get here, login was successful on the server
    const user = result.user
    console.log('Server returned user:')
    console.log(user)

    if (!user || user === undefined || user === null || Object.keys(user).length === 0) {
      setLoading(false)
      toast.error('Server could not locate that user. Please check your username and password and try again.')
      return
    }
    if (!user.selectedVehicles || user.selectedVehicles === undefined) user.selectedVehicles = []
    await props.login(user)
    // setLoading(false)
    console.log('Loading set to false in Login component. Pushing history to /')
    toast.success('Logged in successfully!', { autoClose: 3500 })
    return history.push('/')
  }

  if (loading) return <Loading message="Logging in..." messages={["Logging in..."] } /> 

  return (
    <div className="card">
      <h3>Login</h3>
      <form className="padded" onSubmit={handleLogin} method="POST">
        <label htmlFor="email">Email Address</label>
        <input type="email" name="email" placeholder="Enter email..." value={state.email} onChange={handleInputChange} onBlur={checkAndSave} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter password..." value={state.password} onChange={handleInputChange} />
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
