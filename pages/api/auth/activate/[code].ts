import type { NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import dbConnect from 'lib/dbConnect'
import userService from 'services/user-service'
import { ApiResponse } from 'models/api'

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<never>>) => {
  await dbConnect()

  try {
    const { code } = req.query
    await userService.activate(code as string)
    return res.redirect('/')
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json({ errors: { message: e.message, fields: e.fields } })
    }
    return res.status(500).json({ errors: { message: 'Unexpected error' } })
  }
}

export default handler
