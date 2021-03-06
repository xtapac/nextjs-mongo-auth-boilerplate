import { ReactNode, useEffect } from 'react'
import Head from 'next/head'

const FullPageForm: React.FunctionComponent = ({ children }) => {
  useEffect(() => {
    document.querySelector('html')?.classList.add('h-full', 'bg-gray-50')
    document.querySelector('body')?.classList.add('h-full')
  }, [])

  return (
    <>
      <Head>
        <title>Default</title>
        <meta charSet="utf-8" />
      </Head>
      {children}
    </>
  )
}

export default FullPageForm
