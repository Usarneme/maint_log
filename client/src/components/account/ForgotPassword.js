import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Loading from '../Loading'
import '../../styles/forgotPassword.css'

function ForgotPassword(props) {
  const [formDisplayed, toggleFormDisplay] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = React.createRef()

  const handleSubmit = event => {
    event.preventDefault()
    console.log('Forgot password form submitted.')
    console.log(inputRef.current.value)
    // console.dir(event)
    setLoading(true)
    alert('Password resets are not currently enabled. Apologies.')
    // TODO - import helper to reach /forgot api... 
    setTimeout(() => {
      setLoading(false)
    }, 500)
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
        <input className="button" type="submit" value="Send a Reset" />
      </form>
    </div>
  )
}

ForgotPassword.propTypes = {
  email: PropTypes.string.isRequired
}

export default ForgotPassword
