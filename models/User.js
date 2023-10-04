import { mongoose, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken'

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
      default:
        'https://www.seekpng.com/png/detail/966-9665493_my-profile-icon-blank-profile-image-circle.png',
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    roles: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Role',
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

UserSchema.methods.createJwtToken = function () {
  return Jwt.sign(
    { id: this._id, email: this.email },
    process.env.SECRET_TOKEN,
    { expiresIn: process.env.JWT_LIFETIME }
  )
}

export default mongoose.model('User', UserSchema)
