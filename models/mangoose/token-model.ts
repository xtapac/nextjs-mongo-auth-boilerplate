import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  expiration: { type: Date },
  issued: { type: Date, default: Date.now() },
})

export default mongoose.models.Token || mongoose.model('Token', TokenSchema)
