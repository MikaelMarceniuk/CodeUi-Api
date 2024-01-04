import { FastifyInstance } from 'fastify'
import portfolioContactDiscordController from './portfolioContact'

const discordRouter = async (app: FastifyInstance) => {
  app.post('/portfolioContact', portfolioContactDiscordController)
}

export default discordRouter
