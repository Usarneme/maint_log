const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

mongoose.Promise = global.Promise

const vehicleSchema = new mongoose.Schema({
	year: {
		type: Number,
		trim: true,
		required: 'Please provide the year of your vehicle.'
	},
	make: {
		type: String,
		trim: true,
		required: 'Please provide a vehicle manufacturer.'
	},
	model: {
		type: String,
		trim: true,
		required: 'Please provide the vehicle model.'
	},
	odometer: Number,
	odometerHistory: [{
		date: Date,
		value: Number
	}],
	owner: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'Unable to associate Vehicle with User. Please try again.'
	},
	primary: Boolean, // which vehicle is shown on the account by default, changed in settings
	vin: String
},
{
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
})

vehicleSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Vehicle', vehicleSchema)
