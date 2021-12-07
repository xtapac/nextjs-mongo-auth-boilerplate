import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import ApiError from 'lib/exceptions/api-error'
import tokenService from 'services/token-service'
import { ApiResponse } from 'models/api'

const withApiAuth =
  <T>(handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => {
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

      req.user = { id: userData.userid }

      return handler(req, res)
    } catch (e) {
      if (e instanceof ApiError) {
        return res.status(e.status).json({ errors: { message: e.message, fields: e.fields } })
      }
      return res.status(500).json({ errors: { message: 'Unexpected error' } })
    }
  }

export default withApiAuth
