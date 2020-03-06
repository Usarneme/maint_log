const mongoose = require('mongoose')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')
const { promisify } = require('es6-promisify')

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' })
}

exports.validateAccountUpdate = (req, res, next) => {
  console.log('validating account update. req ')
  console.log(req.body)

  if (req.originalUrl === '/register') { // can post to this from /register and /account updates.
    req.checkBody('password', 'Password must be at least six characters.').isLength({ min: 6 })
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty()
    req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password)  
  }

  req.sanitizeBody('name')
  req.checkBody('name', 'You must supply a name!').notEmpty()
  req.checkBody('email', 'That Email is not valid!').isEmail()
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  })

  if (req.vehicleYear) {
    req.sanitizeBody('vehicleYear')
    req.checkBody('vehicleYear', 'Please enter a valid vehicle year').notEmpty()
  }
  if (req.vehicleMake) {
    req.sanitizeBody('vehicleMake')
    req.checkBody('vehicleMake', 'Please ender a valid vehicle manufacturer (make).').notEmpty()
  }
  if (req.vehicleModel) {
    req.sanitizeBody('vehicleModel')
    req.checkBody('vehicleModel', 'Please ender a valid vehicle model.').notEmpty()
  }
  if (req.vehicleOdometer) {
    req.sanitizeBody('vehicleOdometer')
    req.checkBody('vehicleOdometer', 'Please ender a valid odometer reading.').notEmpty()
  }

  const errors = req.validationErrors()
  if (errors) {
    console.log('Errors found: '+errors)
    req.flash('error', errors.map(err => err.msg))
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
    return // stop the function
  }
  next()
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name })
  const register = promisify(User.register, User)
  await register(user, req.body.password)
  next() // pass to authController.login
}

exports.account = async (req, res) => {
  const vehicle = await Vehicle.find({ owner: req.user._id })
  res.render('account', { title: 'Edit Your Account', vehicle })
}

exports.updateAccount = async (req, res, next) => {
  console.log('Posting to update account: ')
  console.log(req.body)

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

  const userPromise = User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: accountUpdates },
    { new: true, runValidators: true, context: 'query' }
  )

  const vehiclePromise = Vehicle.updateOne(
    { owner: req.user._id },
    { $set: vehicleUpdates },
    { upsert: true, new: true, runValidators: true, context: 'query'}
  )

  const [user, vehicle] = await Promise.all([userPromise, vehiclePromise]);

  req.flash('success', 'Profile updated.')
  next()
}
