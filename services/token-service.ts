import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ObjectId } from 'mongoose'
import tokenModel from 'models/mangoose/token-model'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

export type JWTSession = {
  userid: string
}

if (!JWT_ACCESS_SECRET) {
  throw new Error('Please define the JWT_ACCESS_SECRET environment variable inside .env.local')
}

const generateTokens = (payload: JWTSession) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' })
  const refreshToken = crypto.randomBytes(32).toString('hex')
  return {
    accessToken,
    refreshToken,
  }
}

const validateAccessToken = (token: string): JWTSession | null => {
  try {
    const sessionData = jwt.verify(token, JWT_ACCESS_SECRET)
    return sessionData as JWTSession
  } catch (e) {
    return null
  }
}

const validateRefreshToken = async (token: string): Promise<JWTSession | null> => {
  try {
    const hashedRefreshToken = crypto.createHash('sha256').update(token).digest('hex')
    const tokenData = await tokenModel.findOne({
      refreshToken: hashedRefreshToken,
      expiration: { $gt: Date.now() },
    })
    return { userid: tokenData.user } as JWTSession
  } catch (e) {
    return null
  }
}

const saveToken = async (userId: ObjectId, refreshToken: string) => {
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')

  const tokenData = await tokenModel.findOne({ refreshToken: hashedRefreshToken })
  const refreshExpiration = new Date().setDate(new Date().getDate() + 30)
  if (tokenData) {
    tokenData.refreshToken = hashedRefreshToken
    tokenData.expiration = refreshExpiration
    tokenData.save()
    return
  }
  tokenModel.create({
    user: userId,
    refreshToken: hashedRefreshToken,
    expiration: refreshExpiration,
  })
  tokenModel.deleteMany({ expiration: { $lt: Date.now() } })
  return
}

const removeToken = async (refreshToken: string) => {
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const tokenData = await tokenModel.deleteOne({ refreshToken: hashedRefreshToken })
  return tokenData
}

const findToken = async (refreshToken: string) => {
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const tokenData = await tokenModel.findOne({ refreshToken: hashedRefreshToken })
  return tokenData
}

const TokenService = {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  findToken,
}

export default TokenService
