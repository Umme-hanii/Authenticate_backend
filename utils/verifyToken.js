import Jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { createError } from './error.js'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) {
    next(createError(StatusCodes.FORBIDDEN, 'Invalid token'))
  }
  Jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      next(createError(StatusCodes.FORBIDDEN, 'Invalid Token'))
    }
    req.user = user
    next()
  })
}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next()
    } else {
      return next(createError(StatusCodes.FORBIDDEN, 'You are not authorized'))
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(createError(StatusCodes.FORBIDDEN, 'You are not authorized'))
    }
  })
}
