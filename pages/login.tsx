import type { NextPageCustom } from 'next'
import FullPageForm from 'layouts/fullpageform'
import Login from 'components/Login'

const LoginPage: NextPageCustom = () => {
  return <Login />
}

LoginPage.getLayout = function getLayout(page: React.ReactNode) {
  return <FullPageForm>{page}</FullPageForm>
}

export default LoginPage
