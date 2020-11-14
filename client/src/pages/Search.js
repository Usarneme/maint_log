import React from 'react'
import PropTypes from 'prop-types'

import SearchBox from '../components/SearchBox'

function Search() {
  return (
    <div className="inner">
      <h2 className="card">Search</h2>
      <div className="card search__div">
        <SearchBox />
      </div>
    </div>
  )  
}

Search.propTypes = {
  user: PropTypes.shape({
    cookies: PropTypes.string,
    email: PropTypes.string,
    log: PropTypes.array,
    name: PropTypes.string,
    sessionID: PropTypes.string,
    userID: PropTypes.string,
    vehicle: PropTypes.array,
    selectedVehicles: PropTypes.array
  })
}

export default Search