const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const logSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name for this maintenance item.'
  },
  vehicle: {
    type: String,
    trim: true,
    required: 'Please select a vehicle for this maintenance item.'
  },
  dateEntered: {
    type: Date,
    default: Date.now
  },
  dateStarted: {
    type: Date,
  },
  dateCompleted: {
    type: Date,
  },
  dateDue: {
    type: Date
  },
  mileageDue: {
    type: Number
  },
  shortDescription: {
    type: String,
    required: 'Please include a short description of this maintenance item.'
  },
  longDescription: {
    type: String
  },
  tools: [String],
  parts: [String],
  partsCost: {
    type: Number
  },
  laborCost: {
    type: Number
  },
  serviceLocation: {
    type: String
  },
  receipts: [String],
  odometer: Number,
  slug: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  } 
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

logSchema.indexes({
  name: 'text',
  shortDescription: 'text',
  longDescription: 'text'
})

logSchema.pre('save', async function(next) {
  this.dateEntered = Date.now()
  this.tools = this.tools.split(",")
  console.log(this)
  if (!this.isModified('name')) {
    next() 
    return
  }
  this.slug = slug(this.name)
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const logsWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (logsWithSlug.length) {
    this.slug = `${this.slug}-${logsWithSlug.length + 1}`
  }
  next()
})

module.exports = mongoose.model('Log', logSchema)
