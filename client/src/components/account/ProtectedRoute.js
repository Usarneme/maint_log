import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import UserContext from '../../contexts/UserContext'

function ProtectedRoute(props) {
  const { user, updateUserState } = useContext(UserContext)
  let isLoggedIn = false
  if (user && Object.keys(user).length > 0 && user.cookies && user.cookies.length > 0) isLoggedIn = true
  return (isLoggedIn ?
    <Route {...props} user={user} updateUserState={updateUserState} >{props.children}</Route> :
    <Redirect to='/welcome' />)
}

export default ProtectedRoute