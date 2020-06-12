import React from 'react'
import PropTypes from 'prop-types'
import LogForm from '../components/log/LogForm'
import { useHistory } from 'react-router-dom'

function Add(props) {
  const history = useHistory()
  return <LogForm {...props} history={history} />
}

Add.propTypes = {
  user: PropTypes.shape({
    cookies: PropTypes.string,
    email: PropTypes.string,
    log: PropTypes.array,
    name: PropTypes.string,
    sessionID: PropTypes.string,
    userID: PropTypes.string,
    vehicles: PropTypes.array,
    selectedVehicles: PropTypes.array 
  }),
  updateUserState: PropTypes.func.isRequired
}

export default Add