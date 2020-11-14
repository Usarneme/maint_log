import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/siteTitle.css'

function SiteTitle() {
  return (
    <Link to='/' className='siteTitle'>
      <h1>Vehicle Maintenance Log</h1>
    </Link>
  )
}

export default SiteTitle