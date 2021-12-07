import mongoose from 'mongoose'
import validator from 'validator'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty'],
    trim: true,
    lowercase: true,
    validate: {
      validator: () => validator.isEmail,
      message: 'Invalid email address',
    },
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password should be minimum 6 characters'],
    select: false,
  },
  isActivated: { type: Boolean, default: false, select: false },
  activationCode: { type: String, select: false },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
