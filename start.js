require('dotenv').config({ path: 'variables.env' })

const mongoose = require('mongoose')
// Deprecation warnings, updated per: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise // Have Mongoose use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`Error: ${err.message}`)
})

// Models
require('./models/Log')
require('./models/User')
require('./models/Vehicle')

const app = require('./app')
app.set('port', process.env.PORT || 7777)

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
