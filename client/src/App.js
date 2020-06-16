import React from 'react'

import { UserProvider } from './contexts/UserContext'
import AppRouter from './AppRouter'

import './styles/normalize.css'
import './styles/layout.css'

class App extends React.Component {
  constructor(props) {
    super(props)
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
      updateUserState: this.updateUserState
    }
  }

  updateUserState = async user => {
    // this.saveUserToLocalStorage(user)
    await this.setState({ user })
  }

  componentDidMount() {
    const preferredTheme = localStorage.getItem('maint_log_theme') || 'dark'
    document.documentElement.className = preferredTheme
    localStorage.setItem('maint_log_theme', preferredTheme)
  }

  render() {
    const context = { user: this.state.user, updateUserState: this.updateUserState }

    return (
      <UserProvider value={context}>
        <AppRouter />
      </UserProvider>
    )
  }
}

export default App
