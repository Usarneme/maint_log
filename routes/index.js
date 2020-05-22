const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const passport = require('passport')

const authController = require('../controllers/authController')
const logController = require('../controllers/logController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers')

// ---------------- GET RENDERED PAGES ------------------------
// ---------------- ONLY USED BY EXPRESS/PUG APP ---------
router.get('/', catchErrors(logController.homePage))
router.get('/add', authController.isLoggedIn, logController.addLogPage)
router.get('/log', authController.isLoggedIn, catchErrors(logController.getLogPage))
router.get('/log/page/:page', authController.isLoggedIn, catchErrors(logController.getLogPage))
router.get('/log/:id/edit', authController.isLoggedIn, catchErrors(logController.editLogPage))
router.get('/log/:slug', catchErrors(logController.getLogBySlug))
router.get('/search', authController.isLoggedIn, catchErrors(logController.searchPage))
router.get('/upcoming-maintenance', authController.isLoggedIn, catchErrors(logController.upcomingMaintenancePage))

router.get('/login', userController.loginPage)
router.get('/account', authController.isLoggedIn, catchErrors(userController.accountPage))
router.get('/account/reset/:token', catchErrors(authController.reset))
router.get('/register', userController.registerPage)
router.get('/logout', authController.logout)

// ---------------- POST APP DATA -----------------------------
// ---------------- ONLY USED BY EXPRESS/PUG APP ---------
router.post('/login', authController.login)
router.post('/register',
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    body('password', 'You must supply a password.').isLength({ min: 6 }),
    body('passwordConfirm', 'Your passwords do not match.').custom((value, { req }) => value === req.body.password)
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.register), // Registering adds session. pass to login handler
  authController.login // confirms auth and redirects to either / (pass) or /login (fail)
)

router.post('/account', 
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    body('vehicleYear', 'Please enter a valid vehicle year').not().isEmpty().trim().escape(),
    body('vehicleMake', 'Please ender a valid vehicle manufacturer (make).').not().isEmpty().trim().escape(),
    body('vehicleModel', 'Please ender a valid vehicle model.').not().isEmpty().trim().escape()
  ],
  userController.validateAccountUpdate,
  userController.updateAccount,
  catchErrors(userController.accountPage)
)

// ---------------- SHARED BY PUG APP AND API ------------
router.post('/add',
  logController.addPhotoToRequest, // TODO allow multiple simultaneous photo uploads (HOC?)
  catchErrors(logController.uploadPhoto),
  catchErrors(logController.createLog)
)
router.post('/add/:id',
  logController.addPhotoToRequest,
  catchErrors(logController.uploadPhoto),
  catchErrors(logController.updateLog)
)

router.post('/delete/log/entry/:id', authController.isLoggedIn, catchErrors(logController.deleteLogEntry))
router.post('/remove/photo/:filename', authController.isLoggedIn, catchErrors(logController.removePhoto))
router.post('/account/forgot', catchErrors(authController.forgot))
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)

// ---------------- ONLY USED BY API CONSUMER(S) ----------
router.get('/api/search', catchErrors(logController.searchLog))
router.get('/api/log', authController.isLoggedIn, logController.getLogData)

router.post('/api/login', passport.authenticate('local'), catchErrors(userController.getApiUserData))
router.post('/api/logout', authController.apiLogout)
router.post('/api/register', 
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

router.post('/api/account', 
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.updateAccount),
  catchErrors(userController.getApiUserData)
)

router.post('/api/vehicle',
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

router.post('/api/vehicle/add',
  [
    body('year', 'Your must provide a Vehicle year.').not().isEmpty().trim().escape(),
    body('make', 'Your must provide a Vehicle make.').not().isEmpty().trim().escape(),
    body('model', 'Your must provide a Vehicle model.').not().isEmpty().trim().escape(),
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.addVehicle),
  catchErrors(userController.getApiUserData)
)

module.exports = router