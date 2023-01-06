import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import dbConnect from 'lib/dbConnect'
import userService from 'services/user-service'
import { ApiResponse } from 'models/api'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<unknown>>) => {
  await dbConnect()

  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw ApiError.UnauthorizedError('Failed authorization')
    }
    await userService.logout(refreshToken)
    res.setHeader('Set-Cookie', serialize('refreshToken', '', { maxAge: -1, path: '/' }))
    return res.status(200).json({ data: {} })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json({ errors: { message: e.message, fields: e.fields } })
    }
    return res.status(500).json({ errors: { message: 'unexpected' } })
  }
}

export default handler
