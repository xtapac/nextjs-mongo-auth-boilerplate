export interface ApiErrorResponse {
  errors: {
    message: string
    fields?: Array<{ field: string; message: string }>
  }
}
