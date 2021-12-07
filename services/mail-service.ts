import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER)

const sendActivationMail = async (to: string, link: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Account activation',
      text: '',
      html: `
                    <div>
                        <h1>To activate your account please follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    })
  } catch (e) {
    //
  }
}

const MailService = {
  sendActivationMail,
}

export default MailService
