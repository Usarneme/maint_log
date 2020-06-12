import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

import Loading from '../components/Loading'
import { resetPassword } from '../helpers'

function PasswordReset(props) {
  // params contains the reset link token
  const { token } = useParams()
  console.log('Rendering password reset with token: '+token)
  const history = useHistory()

  if (!token) history.push('/welcome')
  // verify token validity
  useEffect(() => {
    async function checkValidity() { 
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/reset/${token}/confirm`)
        if (response.status === 200) return true
        console.log('Response received but with status code: '+response.status)
        const error = new Error(response.error)
        throw error
      } catch(err) {
        console.log('Error posting to /account/reset/token/confirm.')
        console.dir(err)
        return false
      }
    }
    // an invalid token is expired or just the wrong hash, don't render anything...
    if (!checkValidity()) history.push('/welcome')
  }, []) // empty [] indicates only run this on initial render/mount, not re-renders

  const [state, setState] = useState({
    token: token,
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

  const handleReset = async event => {
    event.preventDefault()
    const { token, password, passwordConfirm } = state
    setLoading(true)
    console.log('Loading. Sending to /account/reset/:token ')
    console.log(token, password, passwordConfirm)
    const result = await resetPassword(token, password, passwordConfirm)
    setLoading(false)
    if (!result || result.response !== undefined) {
      return alert(`Error resetting password. Please try again. Status ${result.response.status}: ${result.response.statusText}.`)
    }
    if (Object.keys(result.user).length === 0) {
      return alert('Unable to reset the password at this time. Please try again.')
    }
    await props.updateUserState(result.user)
    history.push('/')
  }

  if (loading) return <Loading message="Updating Your Password..." />

  return (
    <div className="card">
      <h3>Password Reset</h3>
      <form className="padded" onSubmit={handleReset} method="POST" encType="multipart/form-data" multiple="multiple">
        <input type="hidden" name="token" value={token} />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Enter password..." value={state.password || ''} onChange={handleInputChange} />
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input type="password" name="passwordConfirm" placeholder="Confirm password..." value={state.passwordConfirm || ''} onChange={handleInputChange} />
        <input className="button" type="submit" value="Reset Password →" />
      </form>
    </div>
  )
}

PasswordReset.propTypes = {
  updateUserState: PropTypes.func.isRequired
}

export default PasswordReset