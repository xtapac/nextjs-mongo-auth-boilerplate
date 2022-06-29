import request from 'lib/request'
import UserDto from 'models/dto/user'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ApiDataResponse, ApiSession } from 'models/api'

const AuthContext = React.createContext(
  {} as {
    user: UserDto | null
    logout: () => void
    login: (user: string, password: string) => Promise<ApiSession>
    register: (user: string, password: string, password2: string) => Promise<ApiSession>
    isAuthenticated: boolean
    isLoading: boolean
  }
)

export const AuthProvider = ({ token, initialUserValue, children }: any) => {
  const { data: user, mutate } = useSWR('/auth/me', request.get, {
    fallbackData: initialUserValue,
  })
  const router = useRouter()
  const isAuthenticated = !!user
  const isLoading = user === undefined

  // Hydrate token from ssr
  useEffect(() => {
    if (!token) return
    localStorage.setItem('token', token)
  }, [])

  const login = async (email: string, password: string) => {
    return await request.post<ApiSession>('/auth/login', { email, password }).then((session) => {
      localStorage.setItem('token', session.accessToken)
      mutate(session.user, false)
      return session
    })
  }

  const logout = async () => {
    localStorage.removeItem('token')
    return await request.post<ApiSession>('/auth/logout', {}).then((json) => {
      localStorage.removeItem('token')
      mutate(null, false)
      return json
    })
  }

  const register = async (email: string, password: string, password2: string) => {
    return await request
      .post<ApiSession>('/auth/register', { email, password, password2 })
      .then((session) => {
        localStorage.setItem('token', session.accessToken)
        mutate(session.user, false)
        return session
      })
  }

  useEffect(() => {
    const Component = children.type

    if (!Component.requiresAuth) return

    if (isLoading || isAuthenticated) return

    const route = router.asPath

    router.push(`/login?redirect=${encodeURIComponent(route)}`)
  }, [isAuthenticated, isLoading, children.type.requiresAuth])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
