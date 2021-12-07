import UserModel from 'models/mangoose/user-model'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import mailService from 'services/mail-service'
import tokenService from 'services/token-service'
import UserDto from 'models/dto/user'
import ApiError from 'lib/exceptions/api-error'

const registration = async (email: string, password: string) => {
  const candidate = await UserModel.findOne({ email })
  if (candidate) {
    throw ApiError.BadRequest(`This email address has already been registered`)
  }
  const hashPassword = await bcrypt.hash(password, 3)
  const activationCode = uuidv4()

  const user = await UserModel.create({ email, password: hashPassword, activationCode }).catch(
    (err) => {
      const errors: Array<{ field: string; message: string }> = []
      if (err.errors['email'])
        errors.push({ field: 'email', message: err.errors['email'].properties.message })
      if (err.errors['password'])
        errors.push({ field: 'password', message: err.errors['password'].properties.message })
      if (errors.length > 0) {
        throw ApiError.BadRequest('', errors)
      }
    }
  )
  await mailService.sendActivationMail(
    email,
    `${process.env.NEXT_PUBLIC_API_URL}/auth/activate/${activationCode}`
  )

  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({ userid: user._id })
  await tokenService.saveToken(userDto.id, tokens.refreshToken)

  return { ...tokens, user: userDto }
}

const activate = async (activationLink: string) => {
  const user = await UserModel.findOne({ activationLink })
  if (!user) {
    throw ApiError.BadRequest('Invalid activation link')
  }
  user.isActivated = true
  await user.save()
}

const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select('+password')
  if (!user) {
    throw ApiError.BadRequest('Invalid email or password')
  }
  const isPassEquals = await bcrypt.compare(password, user.password)
  if (!isPassEquals) {
    throw ApiError.BadRequest('Invalid email or password')
  }
  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({ userid: user._id })

  await tokenService.saveToken(userDto.id, tokens.refreshToken)
  return { ...tokens, user: userDto }
}

const logout = async (refreshToken: string) => {
  const token = await tokenService.removeToken(refreshToken)
  return token
}

const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError()
  }
  const userData = await tokenService.validateRefreshToken(refreshToken)
  if (!userData) {
    throw ApiError.UnauthorizedError()
  }
  const user = await UserModel.findById(userData.userid)
  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({ userid: user._id })

  await tokenService.saveToken(userDto.id, refreshToken)
  return { accessToken: tokens.accessToken, user: userDto }
}

const UserService = {
  registration,
  activate,
  login,
  logout,
  refresh,
}

export default UserService
