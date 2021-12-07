import type { NextPageCustom } from 'next'
import Register from 'components/Register'
import FullPageForm from 'layouts/fullpageform'

const RegisterPage: NextPageCustom = () => {
  return <Register />
}

RegisterPage.getLayout = FullPageForm

export default RegisterPage
