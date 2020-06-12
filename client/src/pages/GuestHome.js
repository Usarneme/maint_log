import React, { useEffect, useContext } from 'react'
import UserContext from '../contexts/UserContext'
import Login from '../components/account/Login'
import Register from '../components/account/Register'
import ThemeSwitcher from '../components/account/ThemeSwitcher'

import '../styles/guestHome.css'

function GuestHome(props) {
  const {user, updateUserState} = useContext(UserContext)
  
  useEffect(() => {
    const preferredTheme = localStorage.getItem('theme') || 'dark'
    // const savedUser = JSON.parse(localStorage.getItem('maint_log_user'))
    // pass the saved data to the Login component
    // if (savedUser !== null) { 
    // }
    document.documentElement.className = preferredTheme
  }, []) // empty [] will cause this to only run once on initial render

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
        <Login user={user} updateUserState={updateUserState} history={props.history} />
        <p><strong>New user? </strong>Register an account & start tracking your vehicle maintenance.</p>
        <Register user={user} updateUserState={updateUserState} history={props.history} />
        <ThemeSwitcher />
      </div> 
    </div>
  )
}

export default GuestHome