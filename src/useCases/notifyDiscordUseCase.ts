import Discord from '@libs/discord'

export interface INotifyDiscordRequest {
  name: string
  email: string
  mobileNumber: string
  hearAboutUs: string
  aboutCustomerProject: string
}

interface INotifyDiscordResponse {
  messageId: string
}

class NotifyDiscordUseCase {
  constructor(private discord: Discord) {}

  async execute(
    content: INotifyDiscordRequest,
    channelId: string
  ): Promise<INotifyDiscordResponse> {
    const dChannel = await this.discord.getChannel(channelId)
    const { id: messageId } = await dChannel.send(this.createMessage(content))

    return { messageId }
  }

  private createMessage(content: INotifyDiscordRequest) {
    let msg = `Usuario **${content.name}**, que ouviu sobre a gente pelo **${content.hearAboutUs}**, requisitou contato.\n\n`
    msg += `**======= Sobre o projeto =======**\n`
    msg += `${content.aboutCustomerProject}\n\n`
    msg += `**======= Informacoes de Contato =======**\n`
    msg += `Email: ${content.email}\n`
    msg += `Telefone: ${content.mobileNumber}`

    return msg
  }
}

export default NotifyDiscordUseCase
