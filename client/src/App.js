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

  // TODO componentDidMount() { // check localStorage.getItem(login-preferences) for a stored username }

  updateUserState = async user => {
    // this.saveUserToLocalStorage(user)
    await this.setState({ user })
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
