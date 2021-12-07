import type { NextPageCustom } from 'next'
import Profile from 'components/Profile'
import { useAuth } from 'contexts/auth'

const Home: NextPageCustom = () => {
  const auth = useAuth()

  if (auth.user) {
    return <Profile />
  }
  return null
}

Home.requiresAuth = true

export default Home
