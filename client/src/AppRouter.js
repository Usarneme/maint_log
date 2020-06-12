import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Add from './pages/Add'
import Edit from './pages/Edit'
import GuestHome from './pages/GuestHome'
import Home from './pages/Home'
import Log from './pages/Log'
import NotFound from './pages/NotFound'
import PasswordReset from './pages/PasswordReset'
import Search from './pages/Search'
import Settings from './pages/Settings'
import SingleLogEntry from './pages/SingleLogEntry'
import Todo from './pages/Todo'

import Nav from './components/Nav'
import ProtectedRoute from './components/account/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import SiteTitle from './components/SiteTitle'

import { UserConsumer } from './contexts/UserContext'

function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <SiteTitle />
      <UserConsumer>
        {({ user, updateUserState }) => 
        <div className="container">
          <Switch>
            <Route path="/welcome">
              <GuestHome />
            </Route>
            <ProtectedRoute path="/add">
              <Add user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log" exact>
              <Log user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log/:id/edit" exact>
              <Edit user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log/:slug" exact>
              <SingleLogEntry user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/search">
              <Search user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/settings">
              <Settings user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/todo">
              <Todo user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/" exact={true}>
              <Home user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <Route path="/account/reset/:token" exact>
              <PasswordReset updateUserState={updateUserState} />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
          { user && user.cookies && user.cookies.length > 0 && <Nav /> }
        </div>
        }
      </UserConsumer>
    </Router>
  )
}

export default AppRouter
