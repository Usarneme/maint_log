import React from 'react'
import { NavLink } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import Settings from '../images/account.svg'
import Add from '../images/addLog.svg'
import Log from '../images/log.svg'
import Search from '../images/search.svg'
import Todo from '../images/todo.svg'

import '../styles/nav.css'

function Nav() {
  return (
    <nav className='nav'>
      <NavLink to='/log' exact className='card navLink' activeClassName='navLink--active'>
        <ReactSVG 
          src={Log} 
          role="img" 
          className="svg__dark__fill"
          aria-label="Log Icon" 
          fallback={() => <img src={Log} alt="log icon" description="log icon" className="svg svg__dark__fill" />} /> 
        <h5>Log</h5>
      </NavLink>
      <NavLink to='/add' exact className='card navLink' activeClassName='navLink--active'>
        <ReactSVG 
          src={Add} 
          role="img" 
          className="svg__dark__fill"
          aria-label="Add Icon" 
          fallback={() => <img src={Add} alt="add icon" description="add icon" className="svg svg__dark__fill" />} /> 
        <h5>Add</h5>
      </NavLink>
      <NavLink to='/todo' exact className='card navLink' activeClassName='navLink--active'>
        <ReactSVG 
          src={Todo} 
          role="img" 
          className="svg__dark__fill"
          aria-label="Todo Icon" 
          fallback={() => <img src={Todo} alt="todo icon" description="todo icon" className="svg svg__dark__fill" />} /> 
        <h5>Todo</h5>
      </NavLink>
      <NavLink to='/search' exact className='card navLink' activeClassName='navLink--active'>
        <ReactSVG 
          src={Search} 
          role="img" 
          className="svg__dark__fill"
          aria-label="Search Icon" 
          fallback={() => <img src={Search} alt="search icon" description="search icon" className="svg svg__dark__fill" />} /> 
        <h5>Search</h5>
      </NavLink>
      <NavLink to='/settings' exact className='card navLink' activeClassName='navLink--active'>
        <ReactSVG 
          src={Settings} 
          role="img" 
          className="svg__dark__fill"
          aria-label="Settings Icon" 
          fallback={() => <img src={Settings} alt="settings icon" description="settings icon" className="svg svg__dark__fill" />} /> 
        <h5>Settings</h5>
      </NavLink>
    </nav>
  )
}

export default Nav