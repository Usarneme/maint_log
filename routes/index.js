const express = require('express')
// const router = express.Router()
const { body } = require('express-validator')
const passport = require('passport')

const authController = require('../controllers/authController')
const logController = require('../controllers/logController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers')

// per docs, recommended routing setup
module.exports = function(app) {
  app.post('/add',
    logController.addPhotoToRequest, // TODO allow multiple simultaneous photo uploads
    catchErrors(logController.uploadPhoto),
    catchErrors(logController.createLog)
  )
  app.post('/add/:id',
    logController.addPhotoToRequest,
    catchErrors(logController.uploadPhoto),
    catchErrors(logController.updateLog)
  )

  app.post('/account/forgot', catchErrors(authController.forgot))
  app.post('/account/reset/:token/confirm', catchErrors(authController.confirmToken))
  app.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.changePassword)
  )
  app.post('/api/delete/log/entry/:id', authController.isLoggedIn, catchErrors(logController.deleteLogEntry))
  app.post('/api/delete/photo/:filename', authController.isLoggedIn, catchErrors(logController.removePhoto))

  app.get('/api/search', catchErrors(logController.searchLog))
  app.get('/api/log', authController.isLoggedIn, logController.getLogData)

  app.post('/api/delete/vehicle/:vehicleId', authController.isLoggedIn, catchErrors(userController.deleteVehicle))
  app.post('/api/login', authController.login, catchErrors(userController.getApiUserData))
  app.get('/api/login/failure', authController.loginFailure)

  app.post('/api/logout', authController.apiLogout)
  app.post('/api/register', 
    [
      body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
      body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
      body('password', 'You must supply a password.').isLength({ min: 6 }),
      body('passwordConfirm', 'Your passwords do not match.').custom((value, { req }) => value === req.body.password)
    ],
    userController.validateAccountUpdate,
    catchErrors(userController.register),
    passport.authenticate('local'), 
    catchErrors(userController.getApiUserData)
  )

  app.post('/api/account', 
    [
      body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
      body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    ],
    userController.validateAccountUpdate,
    catchErrors(userController.updateAccount),
    catchErrors(userController.getApiUserData)
  )

  app.post('/api/vehicle',
    [
      body('id', 'There was a problem updating the vehicle. Error: No Vehicle ID provided. Please Try Again.').not().isEmpty().trim().escape(),
      body('year', 'Your must provide a Vehicle year.').not().isEmpty().trim().escape(),
      body('make', 'Your must provide a Vehicle make.').not().isEmpty().trim().escape(),
      body('model', 'Your must provide a Vehicle model.').not().isEmpty().trim().escape(),
    ],
    userController.validateAccountUpdate,
    catchErrors(userController.updateVehicle),
    catchErrors(userController.getApiUserData)
  )

  app.post('/api/vehicle/add',
    [
      body('year', 'Your must provide a Vehicle year.').not().isEmpty().trim().escape(),
      body('make', 'Your must provide a Vehicle make.').not().isEmpty().trim().escape(),
      body('model', 'Your must provide a Vehicle model.').not().isEmpty().trim().escape(),
    ],
    userController.validateAccountUpdate,
    catchErrors(userController.addVehicle)
  )
}
// module.exports = router