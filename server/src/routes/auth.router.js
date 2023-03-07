const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const handleFactory = require('../controllers/handlerFactory')
const User = require('../db/user.model')

const router = Router()


router.get('/', authController.protectAndSetId, handleFactory.getAll(User))

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword', authController.resetPassword)

router.post('/login', authController.login)

router.post(
   '/changeEmail',
   authController.protectAndSetId,
   authController.changeEmail
)

router.patch(
   '/changePassword',
   authController.protectAndSetId,
   authController.changePassword,
)

module.exports = router