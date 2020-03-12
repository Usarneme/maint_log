const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const { promisify } = require('es6-promisify')
const flash = require('connect-flash')
const cors = require('cors')

const routes = require('./routes/index')
const helpers = require('./helpers')
const errorHandlers = require('./handlers/errorHandlers')
require('./handlers/passport')

const app = express()

app.use(cors())
// app.use(cors({ origin: 'http://localhost:3000' }))
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000")
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, content-type")
//   next()
// })

app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'pug') 

app.use(express.static(path.join(__dirname, 'public')))

// Takes raw request data and puts them on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Populates req.cookies
app.use(cookieParser())

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport JS to handle our logins
app.use(passport.initialize())
app.use(passport.session())

// The flash middleware let's us use req.flash('error', 'Error message!'), 
// this will then pass that message to the next page the user requests
app.use(flash())

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers
  res.locals.flashes = req.flash()
  res.locals.user = req.user || null
  res.locals.currentPath = req.path
  next()
})

// Promisify for handling callback-based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req)
  next()
})

app.use('/', routes)

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// If the above routes fail, 404/forward to error handler
app.use(errorHandlers.notFound)

// Development Error Handler - Prints stack trace
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors)
} 

// Production error handler - Hides stack trace
if (app.get('env') === 'production') {
  app.use(errorHandlers.productionErrors)
}

module.exports = app
