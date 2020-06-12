import React from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'

import LogForm from '../components/log/LogForm'

function Edit(props) {
  const history = useHistory()
  const { id } = useParams()
  // find the log entry that matches the ID from the URL parameter...
  const log = props.user.log.filter(entry => entry.id === id)
  return <LogForm {...props} log={log[0]} history={history} />
}

Edit.propTypes = {
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

export default Edit
