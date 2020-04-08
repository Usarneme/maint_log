const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const passport = require('passport')

const authController = require('../controllers/authController')
const logController = require('../controllers/logController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers')

// ---------------------- GET PAGES ----------------------
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

// ---------------------- POST DATA ----------------------
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

router.post('/delete/log/entry/:id', authController.isLoggedIn, catchErrors(logController.deleteLogEntry))
router.post('/remove/photo/:filename', authController.isLoggedIn, catchErrors(logController.removePhoto))
router.post('/login', authController.login)

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

// TODO - re-enable after setting up mailer 
// router.post('/account/forgot', catchErrors(authController.forgot))

router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)

// ---------------------- API DATA ----------------------
router.get('/api/search', catchErrors(logController.searchLog))
router.post('/api/login', passport.authenticate('local'), catchErrors(userController.getUserData))
router.post('/api/logout', authController.apiLogout)
router.get('/api/getLogData', authController.apiConfirmLoggedIn, logController.getLogData)

router.post('/api/register',
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
    body('password', 'You must supply a password.').isLength({ min: 6 }),
    body('password-confirm', 'Your passwords do not match.').custom((value, { req }) => value === req.body.password)
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.register),
  passport.authenticate('local'), 
  catchErrors(userController.getUserData)
)

router.post('/api/update/account', 
  [
    body('name', 'You must supply a name.').not().isEmpty().trim().escape(),
    body('email', 'That Email is not valid.').isEmail().normalizeEmail(),
  ],
  userController.validateAccountUpdate,
  catchErrors(userController.updateAccount),
  catchErrors(userController.getUserData)
)

module.exports = router