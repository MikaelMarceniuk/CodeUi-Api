import env from '@config/env'
import discordRouter from '@controllers/discord/router'
import Discord from '@libs/discord'
import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import MongoDb from '@libs/mongodb'
import userRouter from '@controllers/user/router'

class App {
  app: FastifyInstance

  async init() {
    this.app = fastify()
    await this.loadMiddlewares()
    await this.loadRoutes()

    await new Discord().init()
    await new MongoDb().init()
  }

  async listen() {
    await this.app.listen({ host: '0.0.0.0', port: env.PORT })
    console.log(
      `====== HttpServer is up and running on port ${env.PORT} ======`
    )
  }

  async loadMiddlewares() {
    await this.app.register(cors, {
      origin: 'https://codeui.com.br',
    })

    await this.app.register(jwt, { secret: env.JWT_SECRET })
  }

  async loadRoutes() {
    this.app.get('/api', async (_, reply) => reply.send('Hello World!'))

    this.app.register(discordRouter, { prefix: '/api/discord' })
    this.app.register(userRouter, { prefix: '/api/user' })
  }
}

export default App
