import React from 'react'
import PropTypes from 'prop-types'

import Login from '../components/account/Login'
import Register from '../components/account/Register'
import ThemeSwitcher from '../components/account/ThemeSwitcher'

import '../styles/guestHome.css'

function GuestHome(props) {
  return (
    <div className="inner">
      <div className="welcome__guest__container">
        <section className="welcome__guest__hero">
          <h3>Keep track of the service history of your vehicles.</h3>
          <ul>
            <li>Record what was done, when, by whom, and where.</li>
            <li>Include photos of before and after the service, parts used, and receipts.</li>
            <li>Write short and long descriptions of work done.</li>
            <li>Recurring services can be scheduled for a future due date or mileage.</li>
          </ul>
        </section>
        <p><strong>Returning user? </strong>Please login to access your log.</p>
        <Login login={props.login} />
        <p><strong>New user? </strong>Register an account & start tracking your vehicle maintenance.</p>
        <Register updateUserState={props.updateUserState} />
        <ThemeSwitcher />
      </div> 
    </div>
  )
}

GuestHome.propTypes = {
  updateUserState: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
}
 
export default GuestHome