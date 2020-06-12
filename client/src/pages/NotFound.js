import React from 'react'
import { Redirect } from 'react-router'

function NotFound() {
  console.log('unable to find a page associated with this route. redirecting to /welcome')
  return <Redirect to="/welcome" />
}

export default NotFound