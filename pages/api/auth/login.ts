import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import dbConnect from 'lib/dbConnect'
import userService from 'services/user-service'
import { ApiResponse, ApiSession } from 'models/api'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<ApiSession>>) => {
  await dbConnect()

  try {
    const { email, password } = req.body

    const errors: Array<{ field: string; message: string }> = []

    if (!email) {
      errors.push({ field: 'email', message: 'Required field' })
    }
    if (!password) {
      errors.push({ field: 'password', message: 'Required field' })
    }

    if (errors.length > 0) {
      throw ApiError.BadRequest('', errors)
    }

    const userData = await userService.login(email, password)
    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/',
      })
    )
    res.status(200).json({ data: { accessToken: userData.accessToken, user: userData.user } })
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json({ errors: { message: e.message, fields: e.fields } })
    }
    return res.status(500).json({ errors: { message: 'Unexpected error' } })
  }
}

export default handler
