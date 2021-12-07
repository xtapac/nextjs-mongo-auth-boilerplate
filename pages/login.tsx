import type { NextPageCustom } from 'next'
import FullPageForm from 'layouts/fullpageform'
import Login from 'components/Login'

const LoginPage: NextPageCustom = () => {
  return <Login />
}

LoginPage.getLayout = FullPageForm

export default LoginPage
