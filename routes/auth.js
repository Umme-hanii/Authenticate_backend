import express from 'express'
import {
  registerUser,
  login,
  registerAdmin,
  sendEmail,
  resetPassword,
} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/register-admin', registerAdmin)
router.post('/login', login)

//send reset email
router.post('/send-email', sendEmail)

//reset password
router.post('/reset-password', resetPassword)

export default router
