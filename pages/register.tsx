import type { NextPageCustom } from 'next'
import Register from 'components/Register'
import FullPageForm from 'layouts/fullpageform'

const RegisterPage: NextPageCustom = () => {
  return <Register />
}

RegisterPage.getLayout = function getLayout(page: React.ReactNode) {
  return <FullPageForm>{page}</FullPageForm>
}

export default RegisterPage
