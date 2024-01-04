import env from '@config/env'
import discordRouter from '@controllers/discord/router'
import Discord from '@libs/discord'
import fastify, { FastifyInstance } from 'fastify'

class App {
  app: FastifyInstance

  async init() {
    this.app = fastify()
    await this.loadMiddlewares()
    await this.loadRoutes()

    await new Discord().init()
  }

  async listen() {
    await this.app.listen({ port: env.PORT })
    console.log(
      `====== HttpServer is up and running on port ${env.PORT} ======`
    )
  }

  async loadMiddlewares() {}

  async loadRoutes() {
    this.app.get('/api', async (_, reply) => reply.send('Hello World!'))

    this.app.register(discordRouter, { prefix: '/api/discord' })
  }
}

export default App
