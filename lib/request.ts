import axios from 'axios'
import { ApiSession, ApiDataResponse } from 'models/api'

export const API_URL = process.env.NEXT_PUBLIC_API_URL

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  }
  return config
})

$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<ApiDataResponse<ApiSession>>(`${API_URL}/auth/refresh`, {
          withCredentials: true,
        })
        localStorage.setItem('token', response.data.data.accessToken)
        return $api.request(originalRequest)
      } catch (e) {
        //
      }
    }
    throw error
  }
)

export const get = <T>(url: string) =>
  $api
    .get<ApiDataResponse<T>>(url)
    .then((res) => res.data)
    .then((res) => res.data)

export const post = <T>(url: string, payload: Record<string, string>) =>
  $api
    .post<ApiDataResponse<T>>(url, payload)
    .then((res) => res.data)
    .then((res) => res.data)

const request = { $api, get, post }

export default request
