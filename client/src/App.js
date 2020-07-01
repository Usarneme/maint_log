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
    localStorage.removeItem('maint_log_user')
    this.setState({
      user: { name: '', userID: '', sessionID: '', cookies: '', email: '', log: [], vehicles: [], selectedVehicles: [] },
      isLoggedIn: false  
    })
  }

  login = user => {
    this.saveUserToLocalStorage(user)
    this.setState({ 
      user, 
      isLoggedIn: true 
    })
  }

  updateUserState = user => {
    this.saveUserToLocalStorage(user)
    this.setState({ user })
  }

  saveUserToLocalStorage = user => {
    localStorage.setItem('maint_log_user', JSON.stringify(user))
  }

  componentDidMount() {
    const preferredTheme = localStorage.getItem('maint_log_theme') || 'dark'
    document.documentElement.className = preferredTheme
    localStorage.setItem('maint_log_theme', preferredTheme)
    const userRaw = localStorage.getItem('maint_log_user')
    console.log('User Raw:')
    console.log(userRaw)

    if (userRaw !== null) {
      const user = JSON.parse(userRaw)
      console.log('Mounted App. Found Saved User:')
      console.log(user)
        this.setState({ user, isLoggedIn: true })
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
