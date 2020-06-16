import React, { useEffect, useContext } from 'react'
import UserContext from '../contexts/UserContext'
import Login from '../components/account/Login'
import Register from '../components/account/Register'
import ThemeSwitcher from '../components/account/ThemeSwitcher'

import '../styles/guestHome.css'

function GuestHome() {
  const {user, updateUserState} = useContext(UserContext)

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
        <Login user={user} updateUserState={updateUserState} />
        <p><strong>New user? </strong>Register an account & start tracking your vehicle maintenance.</p>
        <Register user={user} updateUserState={updateUserState} />
        <ThemeSwitcher />
      </div> 
    </div>
  )
}
 
export default GuestHome