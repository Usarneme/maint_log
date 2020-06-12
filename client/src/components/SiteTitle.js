import React from 'react'
import { Link } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import Home from '../images/home.svg'
import '../styles/siteTitle.css'

function SiteTitle() {
  return (
    <Link to='/' className='siteTitle'>
      <ReactSVG src={Home} role="img" aria-label="Home Icon" className="svg" fallback={() => <img src={Home} alt="home icon" description="home icon" className="svg svg__dark__fill" />} /> 
      <h1>Vehicle Maintenance Log</h1>
    </Link>
  )
}

export default SiteTitle