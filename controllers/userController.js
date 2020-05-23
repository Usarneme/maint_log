const mongoose = require('mongoose')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')
const Log = mongoose.model('Log')

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
  const vehiclesPromise = Vehicle.find({ owner: req.user._id })
  const [user, vehicle] = await Promise.all([userPromise, vehiclesPromise])
  return res.render('account', { title: 'Edit Your Account', user, vehicle, flashes: req.flash() })
}

// ---------------------------- ACCOUNT DATA GETTERS AND SETTERS -------------------
exports.validateAccountUpdate = (req, res, next) => {
  // console.log('Posting to validate account update...')
  // console.log(req.body)
  const errors = validationResult(req)
  if (errors.isEmpty()) return next() // passed validation. move to next middleware/handler
  // otherwise, we have failed validation...
  const errorMessages = []
  errors.array().forEach(val => errorMessages.push(val.msg))
  console.log('*** Validation Failed ***'.toUpperCase())
  console.log(errorMessages)
  // console.log(errors.array())
  req.flash('error', errorMessages)
  // api requests return JSON data
  if (req.body.api) return next(errorMessages) 
  // validates updates posted to both /register and /account. only register has a password field
  // TODO this is pretty brittle. find a better way to confirm entry route
  if (req.body.hasOwnProperty('password')) {
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
  // console.log('updateAccount func... owner: '+req.user)
  const accountUpdates = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: accountUpdates },
    { new: true, runValidators: true, context: 'query' }
  )
  req.flash('success', 'Profile updated.')
  console.log('updateAccount completed')
  // console.log(user)
  return next()
}

exports.addVehicle = async (req, res) => {
  console.log('Adding new Vehicle...')
  req.body.owner = req.user._id
  // odometer updates are optional; when provided are indexed by date
  if (req.body.odometer !== 0) {
    console.log('adding new vehicle with new odometer reading...')
    req.body.odometerHistory = [{
      "date": Date.now(),
      "value": req.body.odometer
    }]
  } 
  // console.log(req.body)

  const vehicleId = await (new Vehicle( req.body )).save()
  // console.log(`New vehicle created. ID: ${vehicleId._id}`)
  console.log(vehicleId.errors)
  if (vehicleId.errors !== undefined) return res.status(500)

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { vehicles: vehicleId._id } },
    { $upsert: true } // create the new doc if it doesn't exist
  )
  return res.status(200) // API consumer expects a 200 and no data for a Vehicle addition
}

exports.updateVehicle = async (req, res) => {
  console.log('Updating existing vehicle...')
  console.log(req.body)
  return res.status(200).send({ "ok": "ok" })

  const vehicleUpdates = {
    year: req.body.vehicleYear,
    make: req.body.vehicleMake,
    model: req.body.vehicleModel,
    odometer: req.body.vehicleOdometer,
    primary: req.body.primary
  }

  // both odometer and VIN are optional updates
  if (req.body.vin && req.body.vin !== '') vehicleUpdates.vin = req.body.vin
  if (req.body.vehicleOdometer && req.body.vehicleOdometer !== '') {
    console.log('updating vehicle with new odometer reading...')
    const vehicle = await Vehicle.findOneAndUpdate(
      { owner: req.user._id },
      { $set: vehicleUpdates,
        $push: { odometerHistory: { date: Date.now(), value: req.body.vehicleOdometer } }
      },
      { upsert: true, new: true, runValidators: true, context: 'query'}
    )
  } else {
    console.log('updating vehicle (no odometer reading provided)...')
    const vehicle = await Vehicle.findOneAndUpdate(
      { owner: req.user._id },
      { $set: vehicleUpdates },
      { upsert: true, new: true, runValidators: true, context: 'query'}
    )
  }

  return res.status(200).send(vehicle)
}

exports.getApiUserData = async (req, res) => {
  console.log('getApiUserData')
  const userPromise = User.findById( req.user._id )
  const vehiclesPromise = Vehicle.find({ owner: req.user._id })
  const logPromise = Log.find({ author: req.user._id }).sort({ created: 'desc' })
  const [rawUser, vehicles, log] = await Promise.all([userPromise, vehiclesPromise, logPromise])

  // console.log(rawUser)
  // => _id, name, email, vehicle: empty 'String', vehicles: [] empty array
  let user = {}
  user['_id'] = rawUser._id
  user['name'] = rawUser.name
  user['email'] = rawUser.email
  user['sessionID'] = req.sessionID
  user['cookies'] = req.cookies[process.env.KEY]
  user['vehicles'] = vehicles
  user['log'] = [...log]

  return res.status(200).send(user)
}
