import env from '@config/env'
import { Client, TextChannel } from 'discord.js'

class Discord {
  private static instance: Client<boolean>

  async init() {
    Discord.instance = new Client({ intents: ['DirectMessages'] })

    Discord.instance.on('ready', () =>
      console.log(`Logged in as ${Discord.instance.user?.tag}!`)
    )

    Discord.instance.on('error', (e) => {
      console.log(`Error happenned on Discordbot: ${e.message}`)
      throw e
    })

    await Discord.instance.login(process.env.DISCORD_TOKEN)
  }

  getInstance() {
    if (!Discord.instance) {
      console.error('Discord instance not instantiated')
    }

    return Discord.instance
  }

  async getChannel(channelId: string): Promise<TextChannel> {
    const cachedChannel = Discord.instance.channels.cache.get(channelId)
    if (cachedChannel) return cachedChannel as TextChannel

    const fetchedChannel = await Discord.instance.channels.fetch(channelId)
    if (fetchedChannel) return fetchedChannel as TextChannel

    throw new Error(`Channel not found with channelId: ${channelId}`)
  }
}

export default Discord
