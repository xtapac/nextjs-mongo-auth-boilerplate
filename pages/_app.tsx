import App, { AppContext } from 'next/app'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import Head from 'next/head'
import axios from 'axios'
import jsHttpCookie from 'cookie'
import { AuthProvider } from 'contexts/auth'
import { ApiDataResponse, ApiSession } from 'models/api'
import UserDto from 'models/dto/user'
import 'tailwindcss/tailwind.css'
import { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type Props = AppProps & {
  Component: Page
  auth: {
    token: string | null
    user: UserDto | null
  }
}

function MyApp({ Component, pageProps, auth }: Props) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <AuthProvider token={auth?.token} initialUserValue={auth?.user || undefined}>
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)

  if (appContext.ctx.req?.headers?.cookie) {
    const { refreshToken } = jsHttpCookie.parse(appContext.ctx.req.headers.cookie)

    if (refreshToken) {
      try {
        const sessionData = await axios
          .get<ApiDataResponse<ApiSession>>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            headers: appContext.ctx.req.headers.cookie
              ? { cookie: appContext.ctx.req.headers.cookie }
              : undefined,
            withCredentials: true,
          })
          .then((response) => {
            return response.data
          })

        return {
          ...appProps,
          auth: { token: sessionData.data.accessToken, user: sessionData.data.user },
        }
      } catch {
        // invalid refresh token
      }
    }
  }

  return { ...appProps, auth: { token: null, user: null } }
}

export default MyApp
