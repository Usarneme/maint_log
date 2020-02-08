const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const logController = require('../controllers/logController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(logController.homePage))
router.get('/log', authController.isLoggedIn, catchErrors(logController.getLog))
router.get('/log/page/:page', authController.isLoggedIn, catchErrors(logController.getLog))
router.get('/add', authController.isLoggedIn, logController.addLog)

router.post('/add',
  logController.upload,
  catchErrors(logController.resize),
  catchErrors(logController.createLog)
)
router.post('/add/:id',
  logController.upload,
  catchErrors(logController.resize),
  catchErrors(logController.updateLog)
)

router.get('/log/:id/edit', authController.isLoggedIn, catchErrors(logController.editLog))
router.get('/log/:slug', catchErrors(logController.getLogBySlug))

router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/register', userController.registerForm)

router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
)

router.get('/logout', authController.logout)

router.get('/account', authController.isLoggedIn, userController.account)
router.post('/account', catchErrors(userController.updateAccount))
// router.post('/account/forgot', catchErrors(authController.forgot))
// router.get('/account/reset/:token', catchErrors(authController.reset))
// router.post('/account/reset/:token',
//   authController.confirmedPasswords,
//   catchErrors(authController.update)
// )

router.get('/api/search', catchErrors(logController.searchLog))

module.exports = router
