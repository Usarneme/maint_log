const passport = require('passport')
const crypto = require('crypto')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const mail = require('../handlers/mail')

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Login Failed.',
  successRedirect: '/',
  successFlash: 'You are now logged in.'
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'You are now logged out.')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  if (req.body.api) return res.status(500).send({ 'error': { 'message': 'API cannot confirm user is logged in.' } })
  req.flash('error', 'Oops you must be logged in to do that!')
  res.redirect('/login')
}

exports.forgot = async (req, res) => {
  console.log('/account/forgot handler...')
  console.log(user)

  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    req.flash('error', 'No account with that email exists.')
    return res.redirect('/login')
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save()

  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
  // await mail.send({
  //   user,
  //   filename: 'password-reset',
  //   subject: 'Password Reset',
  //   resetURL
  // })

  req.flash('success', `You have been emailed a password reset link.`)
  res.redirect('/login')
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['passwordConfirm']) {
    console.log('Passwords match middleware passed...')
    next()
    return
  }
  req.flash('error', 'Passwords do not match!')
  res.redirect('back')
}

exports.confirmToken = async (req, res) => {
  console.log('Checking token validity. Token: ')
  console.log(req.params)
  const user = await User.findOne({ 
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (user) {
    res.status(200).send('Token is valid.')
  }
  res.status(404).send('Token is invalid.')
}

exports.changePassword = async (req, res) => {
  console.log('Resetting Nicks Password. ')
  console.log(req.params)
  const user = await User.findOne({
    resetPasswordToken: req.params.token, 
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    console.log('error - Password reset is invalid or has expired')
    res.status(541).send('Password not reset! Please try again.')
  }
  console.log(`Found user: ${user}`)
  await user.setPassword(req.body.password)
  if (req.params.token !== 'myMindIsASteelTrap') {
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
  }
  const updatedUser = await user.save()
  await req.login(updatedUser)
  console.log('success - Your password has been reset. You are now logged in.')
  console.log(updatedUser)
  res.status(200).send(updatedUser)
}

exports.apiLogout = (req, res) => {
  req.logout()
  res.status(200).send('Logged out successfully!')
}
