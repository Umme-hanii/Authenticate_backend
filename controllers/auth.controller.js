import bcrypt from 'bcryptjs'
import Role from '../models/Role.js'
import User from '../models/User.js'

export const registerUser = async (req, res) => {
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
    res.status(200).json({
      msg: `User is successfully registered`,
      user: user,
    })
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}
