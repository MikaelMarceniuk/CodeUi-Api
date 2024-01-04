import RecebemosSeuContatoEmail from '@emails/recebemosSeuContatoEmail'
import Discord from '@libs/discord'
import ResendLib from '@libs/resend'

export interface INotifyDiscordRequest {
  clientName: string
  clientEmail: string
  clientMobileNumber: string
  clientHearAboutUs: string
  clientAboutProject: string
  clientWayOfContact: string
}

interface INotifyDiscordResponse {
  messageId: string
}

class NotifyDiscordUseCase {
  constructor(private discord: Discord, private resend: ResendLib) {}

  async execute(
    content: INotifyDiscordRequest,
    channelId: string
  ): Promise<INotifyDiscordResponse> {
    const dChannel = await this.discord.getChannel(channelId)
    const { id: messageId } = await dChannel.send(this.createMessage(content))

    // TODO Handle error
    await this.resend.sendEmail({
      to: [content.clientEmail],
      subject: 'Recebemos seu contato!',
      html: RecebemosSeuContatoEmail({ nomeCliente: content.clientName }),
    })

    return { messageId }
  }

  private createMessage(content: INotifyDiscordRequest) {
    let msg = `Usuario **${content.clientName}**, que ouviu sobre a gente pelo **${content.clientHearAboutUs}**, requisitou contato.\n\n`
    msg += `**======= Sobre o projeto =======**\n`
    msg += `${content.clientAboutProject}\n\n`
    msg += `**======= Informacoes de Contato =======**\n`
    msg += `Email: ${content.clientEmail}\n`
    msg += `Telefone: ${content.clientMobileNumber}\n`
    msg += `Forma preferida de contato: ${content.clientWayOfContact}`

    return msg
  }
}

export default NotifyDiscordUseCase
