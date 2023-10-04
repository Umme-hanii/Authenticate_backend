import { StatusCodes } from 'http-status-codes'
import Role from '../models/Role.js'
import { createError } from '../utils/error.js'
import { createSuccess } from '../utils/success.js'

export const createRole = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role !== '') {
      const newRole = await Role.create(req.body)
      return next(
        createSuccess(StatusCodes.OK, 'Role successfully created', newRole)
      )
    } else {
      return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
    }
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}

export const updateRole = async (req, res, next) => {
  try {
    const roleId = req.params.id
    const role = await Role.findOne({ _id: roleId })
    if (role) {
      const updatedRole = await Role.findByIdAndUpdate(roleId, req.body, {
        new: true,
      })
      return next(
        createSuccess(StatusCodes.OK, 'Role successfully updated', updatedRole)
      )
    }
    return next(
      createError(StatusCodes.NOT_FOUND, `Role with id ${roleId} is not found`)
    )
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find()
    if (roles) {
      return next(createSuccess(StatusCodes.OK, 'successful', roles))
    } else {
      return next(createSuccess(StatusCodes.NOT_FOUND, `No Roles exists`))
    }
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}

export const getRole = async (req, res, next) => {
  try {
    const roleId = req.params.id
    const role = await Role.find({ _id: roleId })
    if (role) {
      return next(createSuccess(StatusCodes.OK, 'successful', role))
    }
    return next(
      createError(StatusCodes.NOT_FOUND, `Role with id ${roleId} is not found`)
    )
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}

export const deleteRole = async (req, res, next) => {
  try {
    const roleId = req.params.id
    const role = await Role.findOne({ _id: roleId })
    if (role) {
      const deletedRole = await Role.findByIdAndDelete(req.params.id)
      return next(
        createSuccess(
          StatusCodes.OK,
          `Role with id ${roleId} is deleted`,
          deletedRole
        )
      )
    }
    return next(
      createError(StatusCodes.NOT_FOUND, `Role with id ${roleId} is not found`)
    )
  } catch (error) {
    return next(createError(StatusCodes.BAD_REQUEST, 'Bad Request'))
  }
}
