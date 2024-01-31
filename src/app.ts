import env from '@config/env'
import discordRouter from '@controllers/discord/router'
import userRouter from '@controllers/user/router'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import Discord from '@libs/discord'
import Postgresql from '@libs/postgresql'
import fastify, { FastifyInstance } from 'fastify'

class App {
  app: FastifyInstance

  async init() {
    this.app = fastify()
    await this.loadMiddlewares()
    await this.loadRoutes()

    await new Discord().init()
    await new Postgresql().init()
  }

  async listen() {
    await this.app.listen({ host: '0.0.0.0', port: env.PORT })
    console.log(
      `====== HttpServer is up and running on port ${env.PORT} ======`
    )
  }

  async loadMiddlewares() {
    await this.app.register(cors, {
      origin:
        env.NODE_ENV == 'DEV'
          ? 'http://localhost:3000'
          : ['https://codeui.com.br', 'https://dashboard-codeui.vercel.app'],
    })

    await this.app.register(jwt, { secret: env.JWT_SECRET })
    await this.app.register(fastifyMultipart)
  }

  async loadRoutes() {
    this.app.get('/api', async (_, reply) => reply.send('Hello World!'))

    this.app.register(discordRouter, { prefix: '/api/discord' })
    this.app.register(userRouter, { prefix: '/api/user' })
  }
}

export default App
