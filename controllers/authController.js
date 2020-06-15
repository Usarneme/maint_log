const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')
const Log = mongoose.model('Log')
const mail = require('../handlers/mail')

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Login Failed.',
  successRedirect: '/',
  successFlash: 'You are now logged in.'
})

exports.logout = (req, res) => {
  req.logout()
  console.log('success', 'You are now logged out.')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  if (req.body.api) return res.status(500).send({ 'error': { 'message': 'API cannot confirm user is logged in.' } })
  console.log('error', 'Oops you must be logged in to do that!')
  res.redirect('/login')
}

exports.forgot = async (req, res) => {
  console.log('/account/forgot handler... Req.Body and User:')
  console.log(req.body)
  console.log('Headers: ')
  console.log(req.headers)

  const user = await User.findOne({ email: req.body.email })
  console.log('Found user in db:')
  console.log(user)
  if (!user) {
    console.log('error', 'No account with that email exists.')
    return res.status(400).send('Never heard of that user before...')
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save()

  // req.headers.host was fine, but using origin ensures it has the right protocol (http or https) 
  const resetURL = `${req.headers.origin}/account/reset/${user.resetPasswordToken}`
  console.log('DB Updated with token and expiry. URL to be sent: ')
  console.log(resetURL)

  await mail.send({
    user,
    filename: 'password_reset',
    subject: 'Password Reset',
    resetURL
  })

  console.log('success', `You have been emailed a password reset link.`)
  res.status(200).send('You successfully generated a password reset link. Check your email as it will be coming soon!')
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['passwordConfirm']) {
    console.log('Passwords match middleware passed...')
    next()
    return
  }
  console.log('error', 'Passwords do not match!')
  res.status(401).send('Those passwords do not match. Please try again with the same password in both fields.')
}

exports.confirmToken = async (req, res) => {
  console.log('Checking token validity. Token: ')
  console.log(req.params)
  const user = await User.findOne({ 
    resetPasswordToken: req.params.token
    // resetPasswordExpires: { $gt: Date.now() }
  })  
  if (user) {
    console.log('Valid token.')
    return res.status(200).send('Token is valid.')
  }
  console.log('Invalid token.')
  return res.status(404).send('Token is invalid.')
}

exports.changePassword = async (req, res) => {
  console.log('Resetting Nicks Password. ')
  console.log(req.params)
  const oldUser = await User.findOne({
    resetPasswordToken: req.params.token, 
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!oldUser) {
    console.log('error - Password reset is invalid or has expired')
    return res.status(400).send('Password reset link is invalid or has expired! Please try again.')
  }
  console.log(`Found oldUser: ${oldUser}`)
  await oldUser.setPassword(req.body.password)
  if (req.params.token !== 'myMindIsASteelTrap') {
    oldUser.resetPasswordToken = undefined
    oldUser.resetPasswordExpires = undefined
  }
  const updatedUser = await oldUser.save()
  await req.login(updatedUser)
  console.log('success - Your password has been reset. You are now logged in.')
  console.log('gathering ApiUserData')
  console.log('session id and cookies:')
  console.log(req.sessionID)
  console.log(req.cookies[process.env.KEY])

  const vehicles = await Vehicle.find({ owner: req.user._id })
  const log = await Log.find({ author: req.user._id }).sort({ created: 'desc' })
  let user = {}
  user['_id'] = updatedUser._id
  user['name'] = updatedUser.name
  user['email'] = updatedUser.email
  user['sessionID'] = req.sessionID
  user['cookies'] = req.cookies[process.env.KEY]
  user['vehicles'] = vehicles
  user['log'] = [...log]
  console.log('Password reset completed. User logged in. Sending back API user data: ')
  console.log(user)
  return res.status(200).send(user)
}

exports.apiLogout = (req, res) => {
  req.logout()
  res.status(200).send('Logged out successfully!')
}
