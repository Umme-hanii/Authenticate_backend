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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).send(`Email or Password is incorrect`)
    } else {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(404).send(`Email or Password is incorrect`)
      }
      return res.status(500).json({ user: user, msg: 'You are logged in!' })
    }
  } catch (error) {
    return res.status(400).send('Bad Request')
  }
}
