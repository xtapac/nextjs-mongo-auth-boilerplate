import UserModel from 'models/mangoose/user-model'
import UserDto from 'models/dto/user'
import { ApiResponse } from 'models/api'
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import tokenService from 'services/token-service'
import dbConnect from 'lib/dbConnect'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<UserDto | null>>) => {
  await dbConnect()

  let userId = null

  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      throw ApiError.UnauthorizedError('Failed authorization')
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      throw ApiError.UnauthorizedError('Failed authorization')
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      throw ApiError.UnauthorizedError('Failed authorization')
    }

    userId = userData.userid
  } catch {
    // failed access token auth
  }

  const { refreshToken } = req.cookies
  if (!userId && refreshToken) {
    try {
      const userData = await tokenService.validateRefreshToken(refreshToken)
      if (!userData) {
        throw ApiError.UnauthorizedError('Failed authorization')
      }

      userId = userData.userid
    } catch {
      // failed refresh token auth
    }
  }

  if (!userId) {
    res.status(200).json({ data: null })
    return
  }

  const user = await UserModel.findOne({ _id: userId })
  if (!user) {
    res.status(200).json({ data: null })
    return
  }

  res.status(200).json({ data: new UserDto(user) })
}

export default handler
