import { ApiDataResponse } from './api-data-response'
import { ApiErrorResponse } from './api-error-response'

export type ApiResponse<T> = ApiErrorResponse | ApiDataResponse<T>
