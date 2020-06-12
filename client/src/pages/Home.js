import React from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'
import PropTypes from 'prop-types'

import SearchIcon from '../images/search.svg'
import AddIcon from '../images/addLog.svg'
import TodoIcon from '../images/todo.svg'
import SettingsIcon from '../images/account.svg'
import LogIcon from '../images/log.svg'

import '../styles/home.css'

function Home(props) {
  console.log('Home page rendering with props:')
  console.dir(props)
  
  return (
    <div className="inner">
      <div className="home__actions__container">
        <Link className="button card home__actions history" to="/log">
          <ReactSVG src={LogIcon} role="img" aria-label="Log Icon" fallback={() => <img src={LogIcon} alt="log icon" description="log icon" className="svg" />} /> 
          <p>View Full Maintenance Log History</p>
        </Link>
        <Link className="button card home__actions add" to="/add">
          <ReactSVG src={AddIcon} role="img" aria-label="Add Icon" fallback={() => <img src={AddIcon} alt="add icon" description="add icon" className="svg" />} /> 
          <p>Add New Log Entry</p>
        </Link>
        <Link className="button card home__actions todo upcoming-maintenance" to="/todo">
          <ReactSVG src={TodoIcon} role="img" aria-label="Todo Icon" fallback={() => <img src={TodoIcon} alt="todo icon" description="todo icon" className="svg" />} /> 
          <p>View Upcoming Scheduled Maintenance</p>
        </Link>
        <Link className="button card home__actions search__main search" to="/search">
          <ReactSVG src={SearchIcon} role="img" aria-label="Search Icon" fallback={() => <img src={SearchIcon} alt="search icon" description="search icon" className="svg" />} /> 
          <p>Search Log Entries</p>
        </Link>
        <Link className="button card home__actions settings" to="/settings">
          <ReactSVG src={SettingsIcon} role="img" aria-label="Settings Icon" fallback={() => <img src={SettingsIcon} alt="settings icon" description="settings icon" className="svg" />} /> 
          <p>Edit Your Vehicle & Account Settings</p>
        </Link>
      </div>
    </div>
  )
}

Home.propTypes = {
  user: PropTypes.shape({
    cookies: PropTypes.string,
    email: PropTypes.string,
    log: PropTypes.array,
    name: PropTypes.string,
    sessionID: PropTypes.string,
    userID: PropTypes.string,
    vehicle: PropTypes.array,
    selectedVehicles: PropTypes.array
  }),
  updateUserState: PropTypes.func.isRequired
}

export default Home