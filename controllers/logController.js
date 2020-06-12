const mongoose = require('mongoose')
const fs = require('fs')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')
const cloudinary = require('cloudinary').v2

const Log = mongoose.model('Log')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle')

// ---------------------------- SERVER RENDERED PAGES --------------------------
exports.homePage = async (req, res) => {
  res.render('index', { title: 'Vehicle Maintenance Log' })
}

exports.searchPage = async (req, res) => {
  res.render('search', { title: 'Search' })
}

exports.getLogPage = async (req, res) => {
  const page = req.params.page || 1
  const limit = 25
  const skip = (page * limit) - limit

  const logPromise = Log
    .find({ author: req.user._id })
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' })

  const vehiclesPromise = Vehicle.find({ owner: req.user._id })
  const countPromise = Log.countDocuments({ author: req.user._id })

  const [log, count, vehicles] = await Promise.all([logPromise, countPromise, vehiclesPromise])
  const pages = Math.ceil(count / limit)
  if (!log.length && skip) {
    req.flash('info', `Requested page ${page} doesn't exist. Redirected to page ${pages}`)
    res.redirect(`/log/page/${pages}`)
    return
  }
  // console.log(`Log requested for user ${req.user._id} returned: ${log}`)
  res.render('log', { title: 'Log', log, page, pages, count, vehicles })
}

exports.upcomingMaintenancePage = async (req, res, next) => {
  const vehicles = await Vehicle.find({ owner: req.user._id })
  const mileage = vehicles.length > 0 ? vehicles[0].odometer : 0

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
  res.render('upcoming', { title: 'Upcoming Maintenance', log, vehicles })
}

exports.getLogBySlug = async (req, res, next) => {
  const log = await Log.findOne({ slug: req.params.slug }).populate(['author', 'vehicle'])
  if (!log) return next()
  res.render('singleLogEntry', { log, title: log.name })
}

exports.addLogPage = async (req, res) => {
  console.log('/add route, addLogPage controller. user: '+req.user._id)
  const vehicles = await Vehicle.find({ owner: req.user._id })
  res.render('editLog', { title: 'Add Log', vehicles })
}

exports.editLogPage = async (req, res) => {
  const logPromise = Log.findOne({ _id: req.params.id })
  const vehiclesPromise = Vehicle.find({ owner: req.user._id })
  const [log, vehicles] = await Promise.all([logPromise, vehiclesPromise])
  confirmOwner(log, req.user)
  res.render('editLog', { title: `Edit`, log, vehicles })
}

// ---------------------------- PHOTO MIDDLEWARE -------------------------------
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/') // ensure only image files are allowed
    if(isPhoto) {
      next(null, true)
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false)
    }
  }
}

exports.addPhotoToRequest = multer(multerOptions).single('file')

exports.uploadPhoto = async (req, res, next) => {
  // console.log('* Upload photo middleware...')
  // console.log(req.body.photos)
  // tools, parts, and photos arrays come in as stringified: "photo1.jpeg,photo2.jpeg,photo3.jpeg"
  // this includes undefined and "undefined" as a string which must be cleaned up
  // let g = a.map(val => { if (val !== undefined && val !== "undefined") return val }).filter(Boolean)
  const photosArray = req.body.photos.split(',').map(val => { if (val !== undefined && val !== "undefined") return val }).filter(Boolean) || []
  // console.log('created photos array:')
  // console.log(photosArray)
  delete req.body.photos
  req.body.photos = [...photosArray]
  const toolsArray = req.body.tools.split(',').filter(Boolean) || []
  delete req.body.tools
  req.body.tools = [...toolsArray]
  const partsArray = req.body.parts.split(',').filter(Boolean) || []
  delete req.body.parts
  req.body.parts = [...partsArray]
  
  // if there is no file on the request...
  if (!req.file || Object.keys(req.file).length === 0) {
    // check for a file on the request.body...
    if (!req.body.file || Object.keys(req.body.file).length === 0) {
      // console.log('No file upload found (at req.file or req.body.file). Moving to next middleware.')
      return next() // No file submitted. Skip to the next middleware  
    } else {
      // TODO does this ever actually happen??
      // ...there was a req.body.file, putting it on req.file for consistent handling
      // console.log('adding req.body.file to req.file')
      req.file = req.body.file
    }
  }
  // console.log('* Photo included in form submission.')
  // get the filetype e.g.: jpeg, png
  const extension = req.file.mimetype.split('/')[1]
  // create a unique filename and add to the array of photos associated with this log 
  req.body.photos.push(`${uuid.v4()}.${extension}`)

  // resize photo to allow for reasonable maximums
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.quality(70)
  const filename = `./public/uploads/${req.body.photos[req.body.photos.length - 1]}`
  await photo.write(filename)

  // cloudinary options to use the already unique name and not append extra characters
  await cloudinary.uploader.upload(filename, { use_filename: true, unique_filename: false }, (err, image) => {
    if (err) { console.warn(err) }
    console.log("Cloudinary - " + image.public_id)
    console.log("Cloudinary - " + image.url)
  })

  // remove the file from the local filesystem after it uploads to cloud service
  fs.unlink(filename, err => {
    if (err) {
      // log the error for eventual cleanup
      console.log('ERROR!\n\tUNLINK ERROR. Unable to Delete Image.\nImage Filename: '+filename)
      return
    }
    // console.log('successfully deleted local copy of photo '+filename)
  })
  // console.log('Photo uploaded successfully. ')
  return next()
}

exports.removePhoto = async (req, res) => {
  console.log('Log Controller - Remove Photo. Query: ')
  console.log(req.params)

  await Log.updateOne(
    { photos: { $in: [req.params.filename] } },
    { $pull: { photos: req.params.filename } }
  )
  const updatedLog = await Log.find({ author: req.user._id })
  res.json(updatedLog)
}

// ---------------------------- LOG DATA SETTERS AND GETTERS -------------------
exports.createLog = async (req, res) => {
  // console.log('CreateLog func...')
  req.body.author = req.user._id
  // console.log(req.body)
  const newLogEntry = await (new Log(req.body)).save()
  // api posts to this route and expects a 200 + updated log as result
  if (req.body.api) {
    const fullLog = await Log.find({ author: req.user._id })
    return res.status(200).send({ fullLog, newLogEntry })
  }
  req.flash('success', `Successfully Created ${newLogEntry.name}.`)
  res.redirect(`/log/${newLogEntry.slug}`)
}

exports.updateLog = async (req, res) => {
  console.log('updateLog func... body: ')
  req.body.author = req.user._id
  console.log(req.body)

  const newLogEntry = await Log.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new log instead of the old one
    runValidators: true
  }).exec()

  // api posts to this route and expects a 200 + updated log as result
  if (req.body.api) {
    const fullLog = await Log.find({ author: req.user._id })
    return res.status(200).send({ fullLog, newLogEntry })
  }
  req.flash('success', `Successfully updated <strong>${newLogEntry.name}</strong>. <a href="/log/${newLogEntry.slug}">View Log Entry →</a>`)
  res.redirect(`/log/${newLogEntry._id}/edit`)
}

exports.searchLog = async (req, res) => {
  console.log('Log Controller - Search Log. Query: '+req.query.q)

  const logResults = await Log
  .find({
    $and: [
      { author: req.user._id },
      { 
        $text: {
          $search: req.query.q
        }
      }  
    ]
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({
    score: { $meta: 'textScore' }
  })
  // .limit(5)
  res.json(logResults)
}

exports.deleteLogEntry = async (req, res) => {
  console.log('Log Controller - Delete Log Entry. Query: ')
  console.log(req.params)
  const dbUpdate = await Log.findOneAndDelete({ _id: req.params.id })
  console.log('DB updated. Sending response: ')
  console.log(dbUpdate)
  res.json(dbUpdate)
}

exports.getLogData = async (req, res) => {
  const logPromise = Log
    .find({ author: req.user._id })
    .sort({ created: 'desc' })
  const vehiclesPromise = Vehicle.find({ owner: req.user._id })
  const [log, vehicles] = await Promise.all([logPromise, vehiclesPromise])
  res.json({log, vehicles})
}

// ---------------------------- MISC LOG MIDDLEWARE ----------------------------
const confirmOwner = (log, user) => {
  if (!log.author.equals(user._id)) {
    throw Error('You must own a log in order to edit it!')
  }
}
