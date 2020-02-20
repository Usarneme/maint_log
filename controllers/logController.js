const mongoose = require('mongoose')

const Log = mongoose.model('Log')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')

const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    if(isPhoto) {
      next(null, true)
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false)
    }
  }
}

exports.uploadSinglePhoto = multer(multerOptions).single('photos')

exports.resize = async (req, res, next) => {
  console.log('Resize middleware...')
  console.log('Req.body before:')
  console.log(req.body)
  console.log('Req.file before:')
  console.log(req.file)

  // check if there is no new file to resize
  if (!req.file) {
    console.log('No req.file found. Moving to next middleware.')
    next() // skip to the next middleware
    return
  }
  const extension = req.file.mimetype.split('/')[1]
  // This creates the photos array, removes whitespace, and ensures no empty entries
  req.body.photos = req.body.previousPhotos.trim().split(',').filter(Boolean) || []
  // console.log('req.body.photos created. now: '+req.body.photos)
  // console.log(typeof req.body.photos)
  // console.log(Array.isArray(req.body.photos))
  req.body.photos.push(`${uuid.v4()}.${extension}`)

  // now we resize
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photos[req.body.photos.length - 1]}`)

  console.log('Photo uploaded successfully. Passing to next middleware with body: ')
  // console.log(req.body)
  next()
}

exports.homePage = async (req, res) => {
  res.render('index', { title: 'Vehicle Maintenance Log' })
}

exports.addLog = async (req, res) => {
  const vehicle = await Vehicle.find({ owner: req.user._id })
  res.render('editLog', { title: 'Add Log', vehicle })
}

exports.createLog = async (req, res) => {
  req.body.author = req.user._id
  const log = await (new Log(req.body)).save()
  req.flash('success', `Successfully Created ${log.name}.`)
  res.redirect(`/log/${log.slug}`)
}

exports.editLog = async (req, res) => {
  const logPromise = Log.findOne({ _id: req.params.id })
  const vehiclePromise = Vehicle.find({ owner: req.user._id })
  const [log, vehicle] = await Promise.all([logPromise, vehiclePromise])

  confirmOwner(log, req.user)
  res.render('editLog', { title: `Edit ${log.name}`, log, vehicle })
}

exports.updateLog = async (req, res) => {
  const log = await Log.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new log instead of the old one
    runValidators: true
  }).exec()
  req.flash('success', `Successfully updated <strong>${log.name}</strong>. <a href="/log/${log.slug}">View Log Entry →</a>`)
  res.redirect(`/log/${log._id}/edit`)
}

exports.getLog = async (req, res) => {
  const page = req.params.page || 1
  const limit = 4
  const skip = (page * limit) - limit

  const logPromise = Log
    .find({ author: req.user._id })
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' })

  const vehiclePromise = Vehicle.find({ owner: req.user._id })
  const countPromise = Log.count({ author: req.user._id })

  const [log, count, vehicle] = await Promise.all([logPromise, countPromise, vehiclePromise])
  const pages = Math.ceil(count / limit)
  if (!log.length && skip) {
    req.flash('info', `Requested page ${page} doesn't exist. Redirected to page ${pages}`)
    res.redirect(`/log/page/${pages}`)
    return
  }

  // console.log(`Log requested for user ${req.user._id} returned: ${log}`)
  res.render('log', { title: 'Log', log, page, pages, count, vehicle })
}

exports.getLogBySlug = async (req, res, next) => {
  const log = await Log.findOne({ slug: req.params.slug }).populate(['author', 'vehicle'])
  if (!log) return next()
  res.render('singleLogEntry', { log, title: log.name })
}

const confirmOwner = (log, user) => {
  if (!log.author.equals(user._id)) {
    throw Error('You must own a log in order to edit it!')
  }
}

exports.upcomingMaintenance = async (req, res, next) => {
  const vehicle = await Vehicle.find({ owner: req.user._id })
  const mileage = vehicle.length > 0 ? vehicle[0].odometer : 0

  const log = await Log
    .find({ 
      $and: [
        { author: req.user._id }, 
        { $or: [
          { dateDue: { $gte: new Date() } },
          { mileageDue: { $gte: mileage } }
        ]}
      ] 
    })
    .sort({ created: 'desc' })

  if (!log.length) {
    console.log('No upcoming maintenance logs found. ')
    req.flash('info', `Unable to find any logs with a future due date or mileage. Create one now?`)
    res.redirect('add')
    return
  }

  // console.log(`Upcoming Log requested for user ${req.user._id} returned: ${log}`)
  res.render('upcoming', { title: 'Upcoming Maintenance', log, vehicle })
}

exports.searchPage = async (req, res) => {
  res.render('search', { title: 'Search' })
}

exports.searchLog = async (req, res) => {
  console.log('Log Controller - Search Log. Query: '+req.query.q)

  const logResults = await Log
  .find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({
    score: { $meta: 'textScore' }
  })
  // .limit(5)
  res.json(logResults)
}
