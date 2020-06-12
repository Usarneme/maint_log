import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import UserContext from '../../contexts/UserContext'

function ProtectedRoute(props) {
  const { user, updateUserState } = useContext(UserContext)
  let isLoggedIn = false
  if (user && Object.keys(user).length > 0 && user.cookies && user.cookies.length > 0) isLoggedIn = true
  if (!isLoggedIn) return <Redirect to='/welcome' />

  return (
    <Route {...props} user={user} updateUserState={updateUserState} >{props.children}</Route>
  )
}

export default ProtectedRoute