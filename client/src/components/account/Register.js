import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import { register } from '../../helpers'
import Loading from '../Loading'

function Register(props) {
  const history = useHistory()

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const handleRegister = async event => {
    event.preventDefault()
    console.log(state)
    const { name, email, password, passwordConfirm } = state
    setLoading(true)
    console.log('Loading. Sending to register: ')
    console.log(name, email, password, passwordConfirm)
    const result = await register(name, email, password, passwordConfirm)
    if (!result || result.response !== undefined) {
      setLoading(false)
      return alert(`Error registering a new account. Please try again. Status ${result.response.status}: ${result.response.statusText}.`)
    }
    if (Object.keys(result.user).length === 0) {
      setLoading(false)
      return alert('Server was unable to register you at this time. Please try again.')
    }
    await props.updateUserState(result.user)
    history.push('/')
  }

  if (loading) return <Loading message="Registering New User..." />

  return (
    <div className="card">
      <h3>Register</h3>
      <form className="padded" onSubmit={handleRegister} method="POST" encType="multipart/form-data" multiple="multiple">
        <label htmlFor="name">Name</label>
        <input type="text" name="name" placeholder="Enter name..." value={state.name || ''} onChange={handleInputChange} />
        <label htmlFor="email">Email Address</label>
        <input type="email" name="email" placeholder="Enter email..." value={state.email || ''} onChange={handleInputChange} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter password..." value={state.password || ''} onChange={handleInputChange} />
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input type="password" name="passwordConfirm" placeholder="Confirm password..." value={state.passwordConfirm || ''} onChange={handleInputChange} />
        <input className="button" type="submit" value="Register →" />
      </form>
    </div>
  )
}

Register.propTypes = {
  updateUserState: PropTypes.func.isRequired
}

export default Register
