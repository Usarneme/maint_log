import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

import Loading from '../components/Loading'
import { resetPassword } from '../helpers'

function PasswordReset(props) {
  // params contains the reset link token
  const { token } = useParams()
  console.log('Rendering password reset with token: '+token)
  const history = useHistory()
  if (!token) history.push('/welcome')

  // verify token validity
  // an invalid token is expired or just the wrong hash, don't render anything...  
  useEffect(() => {
    async function checkValidity() { 
      try {
        console.log(`posting to: ${process.env.REACT_APP_API_DOMAIN}/account/reset/${token}/confirm`)
        const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/reset/${token}/confirm`)
        console.log(response)
        console.dir(response)
        if (response.status === 200) return true
        if (response.status === 404) history.push('/welcome')
        console.log('Response received but with status code: '+response.status)
        const error = new Error(response.error)
        throw error
      } catch(err) {
        console.log('Error posting to /account/reset/'+token+'/confirm')
        console.dir(err)
        history.push('/welcome')
      }
    }
    checkValidity()
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
    // result upon success is the updated login info (session id, cookies, user, log, vehicles)
    const result = await resetPassword(token, password, passwordConfirm)
    console.log(result)
    setLoading(false)
    if (!result || result.response !== undefined) {
      toast.error(`Error resetting password. Please try again.`)
      console.log(`Status ${result.response.status}: ${result.response.statusText}.`)
      return
    }
    await props.updateUserState(result)
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