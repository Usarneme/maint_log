import React from 'react'

import { UserProvider } from './contexts/UserContext'
import AppRouter from './AppRouter'

import './styles/normalize.css'
import './styles/layout.css'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      user: {
        name: '', 
        userID: '', 
        sessionID: '', 
        cookies: '',
        email: '',
        vehicles: [],
        log: [],
        selectedVehicles: []
      }, 
      updateUserState: this.updateUserState,
      isLoggedIn: false,
      login: this.login,
      logout: this.logout
    }
  }
  
  logout = () => {
    localStorage.removeItem('maint_log_username')
    this.setState({
      user: { name: '', userID: '', sessionID: '', cookies: '', email: '', log: [], vehicles: [], selectedVehicles: [] },
      isLoggedIn: false  
    })
  }

  login = user => {
    this.saveUserToLocalStorage(user)
    this.setState({ user, isLoggedIn: true })
  }

  updateUserState = user => {
    this.saveUserToLocalStorage(user)
    this.setState({ user })
  }

  saveUserToLocalStorage = user => {
    localStorage.setItem('maint_log_user', JSON.stringify(user))
  }

  // APP SETUP - find user preferences if any are saved locally
  componentDidMount() {
    // Theme
    const preferredTheme = localStorage.getItem('maint_log_theme') || 'dark'
    document.documentElement.className = preferredTheme
    localStorage.setItem('maint_log_theme', preferredTheme)

    // Full User Account (for Saved Logins)
    const userRaw = localStorage.getItem('maint_log_user')
    console.log('User Raw:')
    console.log(userRaw)

    if (userRaw !== null) {
      const user = JSON.parse(userRaw)
      if (user && Object.keys(user).length > 0 && user["name"] && user["name"] !== "" && user["name"].length > 0) {
        console.log('Mounted App. Found Previously-Saved User:')
        console.log(user)
        this.setState({ user, isLoggedIn: true })  
      } else {
        console.log('Problem getting data from localStorage (possibly malformed data object - check DevTools).')
      }
    } else {
      // Username Only (for Saved Logins)
      const username = localStorage.getItem('maint_log_username')
      if (username !== null) {
        console.log('Mounted App. Saved Username Found in LocalStorage.')
        this.setState({ user: { name: username }, isLoggedIn: false })
      }
    }
  }

  render() {
    const context = { 
      user: this.state.user, 
      isLoggedIn:this.state.isLoggedIn, 
      updateUserState: this.updateUserState, 
      login: this.login, 
      logout: this.logout 
    }

    return (
      <UserProvider value={context}>
        <AppRouter />
      </UserProvider>
    )
  }
}

export default App
