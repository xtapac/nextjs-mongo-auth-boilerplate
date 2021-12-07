import { IncomingMessage } from 'http'
import { NextPage } from 'next'
import { ReactNode } from 'react'

declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    user: {
      id: string
    }
  }

  // export declare type AppProps = Pick<CompletePrivateRouteInfo, 'Component' | 'err'> & {
  //   router: Router
  // } & Record<string, any> & {
  //     Component: {
  //       getLayout?: (page: JSX.Element) => JSX.Element
  //       requiresAuth?: boolean
  //     }
  //   }

  export type NextPageCustom = NextPage & {
    requiresAuth?: boolean
    getLayout?: (page: ReactNode) => ReactNode
  }
}
