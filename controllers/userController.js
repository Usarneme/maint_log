const mongoose = require('mongoose')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')

const { validationResult } = require('express-validator')

// ---------------------------- SERVER RENDERED PAGES --------------------------
exports.loginPage = (req, res) => {
  return res.render('login', { title: 'Login' })
}

exports.registerPage = (req, res) => {
  return res.render('register', { title: 'Register' })
}

exports.accountPage = async (req, res) => {
  const userPromise = User.findOne({ _id: req.user._id})
  const vehiclePromise = Vehicle.findOne({ owner: req.user._id })
  const [user, vehicle] = await Promise.all([userPromise, vehiclePromise])
  return res.render('account', { title: 'Edit Your Account', user, vehicle, flashes: req.flash() })
}
// ---------------------------- END OF SERVER RENDERED PAGES --------------------

exports.validateAccountUpdate = (req, res, next) => {
  console.log('Posting to validate account update...')
  console.log(req.body)
  const errors = validationResult(req)
  if (errors.isEmpty()) return next() // passed validation. exit
  // otherwise, failed validation...
  console.log('validation failed')
  console.log(errors.array())
  const errorMessages = []
  errors.array().forEach(val => errorMessages.push(val.msg))
  // console.log(errorMessages)
  req.flash('error', errorMessages)

  // validates both /register and /account POSTed updates. only register has a password field
  if (req.body.hasOwnProperty('password')) {
    // POSTing to api/register also uses this middleware
    if (req.body.api) return next('Error validating account update via api')
    return res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
  } else {
    return res.render('account', { title: 'Account', body: req.body, flashes: req.flash() })
  }
}

exports.register = async (req, res, next) => {
  console.log('Registering new user:')
  console.log(req.body)
  const newUser = new User({ email: req.body.email, name: req.body.name })
  await User.registerAsync(newUser, req.body.password)
  return next() // pass to authController.login
}

exports.updateAccount = async (req, res, next) => {
  const accountUpdates = {
    name: req.body.name,
    email: req.body.email
  }

  const vehicleUpdates = {
    year: req.body.vehicleYear,
    make: req.body.vehicleMake,
    model: req.body.vehicleModel,
    odometer: req.body.vehicleOdometer
  }

  const userPromise = User.findByIdAndUpdate(
    req.user._id,
    { $set: accountUpdates },
    { new: true, runValidators: true, context: 'query' }
  )

  const vehiclePromise = Vehicle.findOneAndUpdate(
    { owner: req.user._id },
    { $set: vehicleUpdates },
    { upsert: true, new: true, runValidators: true, context: 'query'}
  )

  const [user, vehicle] = await Promise.all([userPromise, vehiclePromise])
  req.flash('success', 'Profile updated.')
  return next()
}

exports.getUserData = async (req, res) => {
  const userPromise = User.findOne({ _id: req.user._id})
  const vehiclePromise = Vehicle.findOne({ owner: req.user._id })
  const [user, vehicle] = await Promise.all([userPromise, vehiclePromise])
  return res.status(200).json({user, vehicle})
}