import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      <UserConsumer>
        {({ user, updateUserState, isLoggedIn, login, logout }) =>
        <div className="container">
          <ToastContainer
            position="top-center"
            autoClose={6500}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover />
          <ScrollToTop />
          <SiteTitle />
          <Switch>
            <Route path="/welcome">
              { !isLoggedIn && <GuestHome login={login} updateUserState={updateUserState} /> }
              { isLoggedIn && <Home user={user} updateUserState={updateUserState} /> }
            </Route>
            <ProtectedRoute path="/add" isLoggedIn={isLoggedIn} >
              <Add user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log" exact isLoggedIn={isLoggedIn} >
              <Log user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log/:id/edit" exact isLoggedIn={isLoggedIn} >
              <Edit user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/log/:slug" exact isLoggedIn={isLoggedIn} >
              <SingleLogEntry user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/search" isLoggedIn={isLoggedIn} >
              <Search user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/settings" isLoggedIn={isLoggedIn} >
              <Settings user={user} updateUserState={updateUserState} logout={logout} />
            </ProtectedRoute>
            <ProtectedRoute path="/todo" isLoggedIn={isLoggedIn} >
              <Todo user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <ProtectedRoute path="/" exact isLoggedIn={isLoggedIn} >
              <Home user={user} updateUserState={updateUserState} />
            </ProtectedRoute>
            <Route path="/account/reset/:token" exact>
              <PasswordReset updateUserState={updateUserState} />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
          { isLoggedIn && <Nav /> }
        </div>
        }
      </UserConsumer>
    </Router>
  )
}

export default AppRouter
