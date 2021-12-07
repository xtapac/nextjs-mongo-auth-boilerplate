import { useState } from 'react'
import Link from 'next/link'
import type { NextPage } from 'next'
import { useAuth } from 'contexts/auth'
import clsx from 'clsx'

const Login: NextPage = () => {
  const auth = useAuth()
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    auth.logout()
  }
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome {auth.user?.email}
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div>
            <button
              type="submit"
              className={clsx(
                'disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                {
                  'hover:bg-indigo-700': !isLoading,
                }
              )}
              disabled={isLoading}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
