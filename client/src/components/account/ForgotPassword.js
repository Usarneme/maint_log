import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import Loading from '../Loading'
import '../../styles/forgotPassword.css'

function ForgotPassword(props) {
  const [formDisplayed, toggleFormDisplay] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = React.createRef()

  const handleSubmit = async event => {
    event.preventDefault()
    console.log('Forgot password form submitted.')
    console.log(inputRef.current.value)
    const email = inputRef.current.value
    if (!email || email.length < 1) return alert('Please enter a valid email before attempting to request a password reset.')
    setLoading(true)
    try {
      console.log(`posting to: ${process.env.REACT_APP_API_DOMAIN}/account/forgot`)
      const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/forgot`, {"email": email} )
      console.log(response)
      console.dir(response)
      setLoading(false)
      if (response.status === 200) return alert('Password reset requested successfully. Please check your email soon.')
      console.log('Response received but with status code: '+response.status)
      const error = new Error(response.error)
      throw error
    } catch(err) {
      console.log('Error posting to /account/forgot')
      console.dir(err)
    }

  }

  if (loading) return <Loading message="Sending password reset email..." />
  if (!formDisplayed) return <div className="padded"><button className="button" onClick={() => toggleFormDisplay(true)}>Forgot Your Password?</button></div> 

  if (formDisplayed) return ( 
    <div className="forgot__password__container padded">
      <button className="button close__button" onClick={() => toggleFormDisplay(false)}>&times;</button> 
      <h3>I forgot my password!</h3>
      <form onSubmit={handleSubmit} method="POST">
        <label htmlFor="email">Email Address</label>
        <input type="email" name="email" placeholder="Enter email..." defaultValue={props.email} ref={inputRef} />
        <button className="button" type="submit" >Send a Reset</button>
      </form>
    </div>
  )
}

ForgotPassword.propTypes = {
  email: PropTypes.string.isRequired
}

export default ForgotPassword
