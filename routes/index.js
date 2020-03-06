const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const authController = require('../controllers/authController')
const logController = require('../controllers/logController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(logController.homePage))
router.get('/log', authController.isLoggedIn, catchErrors(logController.getLog))
router.get('/log/page/:page', authController.isLoggedIn, catchErrors(logController.getLog))
router.get('/add', authController.isLoggedIn, logController.addLog)

router.post('/add',
  logController.addPhotoToRequest, // TODO allow multiple simultaneous and replace with HOC
  catchErrors(logController.uploadPhoto),
  catchErrors(logController.createLog)
)
router.post('/add/:id',
  logController.addPhotoToRequest,
  catchErrors(logController.uploadPhoto),
  catchErrors(logController.updateLog)
)

router.get('/log/:id/edit', authController.isLoggedIn, catchErrors(logController.editLog))
router.get('/log/:slug', catchErrors(logController.getLogBySlug))

router.get('/upcoming-maintenance', authController.isLoggedIn, catchErrors(logController.upcomingMaintenance))

router.get('/login', userController.loginForm)
router.post('/login', authController.login)

router.get('/register', userController.registerForm)
router.post('/register',
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    body('password', 'You must supply a password.').isLength({ min: 6 }),
    body('password-confirm', 'Your passwords do not match.').custom((value, { req }) => value === req.body.password)
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.register),
  authController.login
)

router.get('/logout', authController.logout)

router.get('/account', authController.isLoggedIn, catchErrors(userController.account))
router.post('/account', 
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    body('vehicleYear', 'Please enter a valid vehicle year').not().isEmpty().trim().escape(),
    body('vehicleMake', 'Please ender a valid vehicle manufacturer (make).').not().isEmpty().trim().escape(),
    body('vehicleModel', 'Please ender a valid vehicle model.').not().isEmpty().trim().escape(),
    body('vehicleOdometer', 'Please ender a valid odometer reading.').not().isEmpty().trim().escape()
  ],
  userController.validateAccountUpdate,
  userController.updateAccount,
  catchErrors(userController.account)
)

// TODO - re-enable after setting up mailer 
// router.post('/account/forgot', catchErrors(authController.forgot))
// router.get('/account/reset/:token', catchErrors(authController.reset))
// router.post('/account/reset/:token',
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// )

router.get('/search', authController.isLoggedIn, catchErrors(logController.searchPage))
router.get('/api/search', catchErrors(logController.searchLog))

router.post('/remove/photo/:filename', authController.isLoggedIn, catchErrors(logController.removePhoto))

module.exports = router
