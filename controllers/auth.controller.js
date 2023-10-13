import { StatusCodes } from 'http-status-codes'
import nodemailer from 'nodemailer'
import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Role from '../models/Role.js'
import User from '../models/User.js'
import { createError } from '../utils/error.js'
import { createSuccess } from '../utils/success.js'
import UserToken from '../models/UserToken.js'

export const registerUser = async (req, res, next) => {
  try {
    const role = await Role.findOne({ role: 'User' })
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
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

export const registerAdmin = async (req, res, next) => {
  try {
    const roles = await Role.find()
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      isAdmin: true,
      roles: roles,
    })

    await user.save()
    return next(
      createSuccess(StatusCodes.OK, 'Admin is successfully registered', user)
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
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return next(createError(StatusCodes.NOT_FOUND, 'Incorrect Password'))
    }

    const token = user.createJwtToken()
    res.cookie('access_token', token, { httpOnly: true })
    return next(createSuccess(StatusCodes.OK, 'You are logged in !!!', user))
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}

export const sendEmail = async (req, res, next) => {
  try {
    const email = req.body.email
    const user = await User.findOne({
      email: { $regex: '^' + email + '$', $options: 'i' },
    })
    if (!user) {
      return next(
        createError(
          StatusCodes.NOT_FOUND,
          'There is no user with this email id'
        )
      )
    }

    //Create a token if user is found with provided email
    const payload = { email: user.email }
    const expiryTime = 300
    const token = Jwt.sign(payload, process.env.SECRET_TOKEN, {
      expiresIn: expiryTime,
    })
    const newToken = await new UserToken({ userId: user._id, token: token })

    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    })

    let mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password',
      html: `
      <html>
        <head>
          <titte>Password Reset Request</title> 
        </head> 
        <body>
          <h1>Password Reset Request</hl> 
          <p>Dear ${user.userName},</p>
          <p>We have received a request to reset your password for your account with BookMYBook. To complete the password reset process, please click on the button below:</p>
          <a href=${process.env.LIVE_URL}/reset/${token}><button style="background—cotor: #4CAF50; color: white; padding: 14px 20px; border: none; 
          cursor: pointer; border—radius: 4px; ">Reset Password</button></a>
          <p>Please note that this link is only valid for a 5mins. If you did not request a password reset, please disregard this message.</p> 
          <p>Thank you,</p> 
          <p>My Team</p> 
        </body>
      </html>
      `,
    }

    mailTransporter.sendMail(mailDetails, async (err, data) => {
      if (err) {
        return next(
          createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
        )
      } else {
        await newToken.save()
        return next(createSuccess(StatusCodes.OK, 'Email successfully sent'))
      }
    })
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.body.token
    const newPassword = req.body.password
    Jwt.verify(token, process.env.SECRET_TOKEN, async (err, data) => {
      if (err) {
        next(
          createError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Reset link is expired'
          )
        )
      } else {
        const user = await User.findOne({
          email: { $regex: '^' + data.email + '$', $options: 'i' },
        })

        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(newPassword, salt)
        user.password = encryptedPassword

        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: user },
            { new: true }
          )

          return next(
            createSuccess(
              StatusCodes.OK,
              'Password Successfully updated',
              updatedUser
            )
          )
        } catch (error) {
          return next(
            createError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              'Something went wrong while resetting the password'
            )
          )
        }
      }
    })
  } catch (error) {
    return next(
      createError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
    )
  }
}
