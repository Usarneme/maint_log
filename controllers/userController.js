const mongoose = require('mongoose')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')
const Log = mongoose.model('Log')

const { validationResult } = require('express-validator')

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
  console.log('error', errorMessages)
  // api requests return JSON data
  if (req.body.api) return next(errorMessages) 
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
  console.log('success - Profile updated.')
  console.log('updateAccount completed')
  // console.log(user)
  return next()
}

exports.addVehicle = async (req, res) => {
  console.log('Adding new Vehicle...')
  req.body.owner = req.user._id
  // odometer updates are optional; when provided are indexed by date
  if (req.body.odometer > 0) {
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
  // console.log('Success! Replying w/200 status code')
  return res.status(200).send({"ok": "ok"}) // API consumer expects a 200 and no data for a Vehicle addition
}

exports.updateVehicle = async (req, res) => {
  // console.log('Updating existing vehicle...')
  delete req.body._v // mongo db generated value, not necessary to save
  delete req.body.id // duplicate of req.body._id, not necessary to save to DB
  console.log(req.body)
  let vehicle
  // check if the odometer reading is unchanged since the last time this vehicle was saved 
  if (req.body.odometer && req.body.odometerHistory && 
    req.body.odometerHistory[req.body.odometerHistory.length-1].value !== odometer) {
    // console.log('updating vehicle with new odometer reading...')
    vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body,
        $push: { odometerHistory: { date: Date.now(), value: req.body.odometer } }
      },
      { upsert: true, new: true, runValidators: true, context: 'query'}
    )
  } else {
    // console.log('updating vehicle (no odometer reading provided)...')
    vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { upsert: true, new: true, runValidators: true, context: 'query'}
    )
  }
  // console.log('Vehicle updated. New vehicle data:')
  // console.log(vehicle)
  return res.status(200).send(vehicle)
}

exports.deleteVehicle = async (req, res) => {
  console.log('User Controller - Delete Vehicle. Vehicle ID per Query: ')
  console.log(req.params)
  await Vehicle.findOneAndDelete({ _id: req.params.vehicleId })
  return res.status(200).send({"ok": "ok"}) // API consumer expects a 200 and no data for a Vehicle deletion
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
