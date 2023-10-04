import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { createError } from '../utils/error.js'
import { createSuccess } from '../utils/success.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return next(createSuccess(StatusCodes.OK, 'All Users', users))
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return next(
        createError(
          StatusCodes.NOT_FOUND,
          `User does not exist with id ${userId}`
        )
      )
    }
    return next(createSuccess(StatusCodes.OK, 'User found !', user))
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}
