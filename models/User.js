const mongoose = require('mongoose')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an email address'
  },
  name: {
    type: String,
    required: 'Please supply a login name',
    trim: true
  },
  vehicles: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Vehicle'
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

// https://github.com/saintedlama/passport-local-mongoose/issues/218
userSchema.statics.registerAsync = function (data, password) {
  return new Promise((resolve, reject) => {
    this.register(data, password, (err, user) => {
      if (err) return reject(err)
      resolve(user)
    })
  })
}

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)
