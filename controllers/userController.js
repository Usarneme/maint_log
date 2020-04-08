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

// ---------------------------- USER DATA GETTERS AND SETTERS -------------------
exports.validateAccountUpdate = (req, res, next) => {
  console.log('Posting to validate account update...')
  console.log(req.body)
  const errors = validationResult(req)
  if (errors.isEmpty()) return next() // passed validation. move to next middleware/handler
  // otherwise, we have failed validation...
  const errorMessages = []
  errors.array().forEach(val => errorMessages.push(val.msg))
  // console.log('validation failed')
  // console.log(errorMessages)
  // console.log(errors.array())
  req.flash('error', errorMessages)
  // validates both /register and /account posted updates. only register has a password field
  if (req.body.hasOwnProperty('password')) {
    // api request returns json only
    if (req.body.api) return next(errorMessages) 
    // web app returns rendered html
    return res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
  } else {
    return res.render('account', { title: 'Account', body: req.body, flashes: req.flash() })
  }
}

exports.register = async (req, res, next) => {
  const newUser = new User({ email: req.body.email, name: req.body.name })
  await User.registerAsync(newUser, req.body.password)
  return next() // After registering immediately login. pass to login handler
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
    odometer: req.body.vehicleOdometer,
    vin: req.body.vin
  }
  const userPromise = User.findByIdAndUpdate(
    req.user._id,
    { $set: accountUpdates },
    { new: true, runValidators: true, context: 'query' }
  )
  const vehiclePromise = Vehicle.findOneAndUpdate(
    { owner: req.user._id },
    { $set: vehicleUpdates,
      $push: { odometerHistory: { date: Date.now(), value: req.body.vehicleOdometer } }
    },
    { upsert: true, new: true, runValidators: true, context: 'query'}
  )
  const [user, vehicle] = await Promise.all([userPromise, vehiclePromise])
  req.flash('success', 'Profile updated.')
  return next()
}

exports.getUserData = async (req, res) => {
  console.log('getUserData')
  const user = req.user
  const sessionID = req.sessionID
  const cookies = req.cookies[process.env.KEY]
  user.vehicle = await Vehicle.findOne({ owner: req.user._id })

  console.log(user)
  // return res.status(200).json({user, vehicle})
  res.status(200).send({ user, sessionID, cookies })
}
