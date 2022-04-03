import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import clsx from 'clsx'
import Link from 'next/link'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { useAuth } from 'contexts/auth'
import { useRouter } from 'next/router'

const Register: NextPage = () => {
  const auth = useAuth()
  const [form, setForm] = useState({ email: '', password: '', password2: '' })
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const defaultErrorFields = { email: null, password: null, password2: null }
  const [errorFields, setErrorFields] = useState(defaultErrorFields)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !success && auth.isAuthenticated) {
      const { redirect } = router.query
      const url = Array.isArray(redirect) ? redirect[0] : redirect
      router.push(url || '/')
    }
  }, [auth.isAuthenticated])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setErrorFields(defaultErrorFields)
    const target = e.target as typeof e.target & {
      email: { value: string }
      password: { value: string }
      password2: { value: string }
    }
    const email = target.email.value
    const password = target.password.value
    const password2 = target.password2.value

    await auth
      .register(email, password, password2)
      .then(() => {
        setSuccess(true)
      })
      .catch((error) => {
        if (error.response?.data?.errors?.message) {
          setError(error.response.data.errors.message)
        }
        if (error.response?.data?.errors?.fields) {
          const fields = error.response.data.errors.fields as Array<{
            field: string
            message: string
          }>
          const errors = fields.reduce((a, v) => ({ ...a, [v.field]: v.message }), {})
          setErrorFields({ ...defaultErrorFields, ...errors })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (success) {
    return (
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="mt-6 text-center text-3xl font-bold text-gray-900">
            A verification link has been sent to your email account.{' '}
            <Link href="/">
              <a className="font-bold text-indigo-600 hover:text-indigo-500">Continue</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              login into an existing one
            </a>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errorFields.email}
                  aria-describedby="email-error"
                />
                {errorFields.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errorFields.email && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errorFields.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={!!errorFields.password}
                  aria-describedby="password-error"
                />
                {errorFields.password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errorFields.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {errorFields.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={form.password2}
                  onChange={(e) => setForm({ ...form, password2: e.target.value })}
                  aria-invalid={!!errorFields.password2}
                  aria-describedby="password2-error"
                />
                {errorFields.password2 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errorFields.password2 && (
                <p className="mt-2 text-sm text-red-600" id="password2-error">
                  {errorFields.password2}
                </p>
              )}
            </div>

            {error && <p className="mt-2 text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className={clsx(
                  'disabled:opacity-50 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  {
                    'hover:bg-indigo-700': !isLoading,
                  }
                )}
                disabled={isLoading}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
