import { mongoose, Schema } from 'mongoose'

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

export default mongoose.model('User', UserSchema)
