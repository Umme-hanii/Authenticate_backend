import express from 'express'
import {
  registerUser,
  login,
  registerAdmin,
} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/register-admin', registerAdmin)
router.post('/login', login)

export default router
