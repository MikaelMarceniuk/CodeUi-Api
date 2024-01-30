import RecebemosSeuContatoEmail from '@emails/recebemosSeuContatoEmail'
import Discord from '@libs/discord'
import ResendLib from '@libs/resend'
import { PortfolioContact } from '@prisma/client'
import IPortfolioContactRepository from '@repository/IPortfolioContactRepository'

interface INotifyDiscordRequest {
  name: string
  email: string
  mobileNumber: string
  hearAboutUs: string
  aboutProject: string
  wayOfContact: string
}

interface INotifyDiscordResponse {
  messageId: string
  newContact: PortfolioContact
}

class NotifyDiscordUseCase {
  constructor(
    private contactRepo: IPortfolioContactRepository,
    private discord: Discord,
    private resend: ResendLib
  ) {}

  async execute(
    content: INotifyDiscordRequest,
    channelId: string
  ): Promise<INotifyDiscordResponse> {
    // TODO Handle error
    const newContact = await this.contactRepo.save({
      name: content.name,
      email: content.email,
      mobile_number: content.mobileNumber,
      hear_about_us: content.hearAboutUs,
      about_project: content.aboutProject,
      way_of_contact: content.wayOfContact
    })

    const dChannel = await this.discord.getChannel(channelId)
    const { id: messageId } = await dChannel.send(this.createMessage(content))

    await this.resend.sendEmail({
      to: [content.email],
      subject: 'Recebemos seu contato!',
      html: RecebemosSeuContatoEmail({ nomeCliente: content.name }),
    })

    return { messageId, newContact }
  }

  private createMessage({name, email, aboutProject, mobileNumber, hearAboutUs, wayOfContact}: INotifyDiscordRequest) {
    let msg = `Usuario **${name}**, que ouviu sobre a gente pelo **${hearAboutUs}**, requisitou contato.\n\n`
    msg += `**======= Sobre o projeto =======**\n`
    msg += `${aboutProject}\n\n`
    msg += `**======= Informacoes de Contato =======**\n`
    msg += `Email: ${email}\n`
    msg += `Telefone: ${mobileNumber}\n`
    msg += `Forma preferida de contato: ${wayOfContact}`

    return msg
  }
}

export default NotifyDiscordUseCase
