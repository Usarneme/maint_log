import React, { useState } from 'react'

function ThemeSwitcher() {
  const [currentTheme, changeTheme] = useState(document.documentElement.className || 'dark')

  function toggleTheme(event) {
    event.preventDefault()
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
    changeTheme(newTheme) 
  }

  return (
    <div className="card">
      <h3>Theme Settings</h3>
      <div className="theme__container padded">
        <label htmlFor="theme" className="" >{`${currentTheme.substring(0,1).toUpperCase()}${currentTheme.substring(1)} Mode Enabled`}</label>
        <button className="button" onClick={toggleTheme}>Switch Theme</button>
      </div>
    </div>
  )
}

export default ThemeSwitcher