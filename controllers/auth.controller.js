import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import Role from '../models/Role.js'
import User from '../models/User.js'
import { createError } from '../utils/error.js'
import { createSuccess } from '../utils/success.js'

export const registerUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const role = await Role.findOne({ role: 'User' })
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      roles: role,
    })
    await user.save()
    return next(
      createSuccess(StatusCodes.OK, 'User is successfully registered', user)
    )
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return next(
        createError(StatusCodes.BAD_REQUEST, 'Email and Password are required')
      )
    }
    const user = await User.findOne({ email: email })
    if (!user) {
      return next(createError(StatusCodes.NOT_FOUND, 'User not found'))
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(createError(StatusCodes.NOT_FOUND, 'Incorrect Password'))
    }
    return next(createSuccess(StatusCodes.OK, 'You are logged in !!!', user))
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}
