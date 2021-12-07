namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT: string
    NEXT_PUBLIC_API_URL: string
    MONGODB_URI: string
    JWT_ACCESS_SECRET: string
    JWT_REFRESH_SECRET: string
    EMAIL_SERVER: string
    EMAIL_FROM: string
  }
}
