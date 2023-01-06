import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import dbConnect from 'lib/dbConnect'
import userService from 'services/user-service'
import { ApiResponse, ApiSession } from 'models/api'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<ApiSession>>) => {
  await dbConnect()

  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw ApiError.UnauthorizedError('Failed authorization')
    }
    const userData = await userService.refresh(refreshToken)
    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/',
      })
    )
    return res.status(200).json({ data: userData })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json({ errors: { message: e.message, fields: e.fields } })
    }
    return res.status(500).json({ errors: { message: 'Unexpected error' } })
  }
}

export default handler
