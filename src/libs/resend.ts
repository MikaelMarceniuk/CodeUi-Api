import env from '@config/env'
import { Resend } from 'resend'

interface ISendEmailParams {
  to: string[]
  subject: string
  html: string
}

class ResendLib {
  private static instance: Resend

  constructor() {
    if (!ResendLib.instance) ResendLib.instance = new Resend(env.RESEND_TOKEN)
  }

  async sendEmail({ to, subject, html }: ISendEmailParams) {
    return await ResendLib.instance.emails.send({
      from: 'CodeUi - NaoResponda <noreply@codeui.com.br>',
      to,
      subject,
      html,
    })
  }
}

export default ResendLib
