class ApiError extends Error {
  status: number
  fields: Array<{ field: string; message: string }>

  constructor(
    status: number,
    message: string,
    fields: Array<{ field: string; message: string }> = []
  ) {
    super(message)
    this.status = status
    this.fields = fields
  }

  static UnauthorizedError(message?: string) {
    return new ApiError(401, message || 'Unauthorized')
  }

  static BadRequest(message: string, fields: Array<{ field: string; message: string }> = []) {
    return new ApiError(400, message, fields)
  }
}

export default ApiError
