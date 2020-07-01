import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

function ProtectedRoute(props) {
  return props.isLoggedIn ? <Route {...props}>{props.children}</Route> : <Redirect to='/welcome' />
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  exact: PropTypes.bool, // exact and path are passed to the Route child component
  path: PropTypes.string.isRequired
}

export default ProtectedRoute