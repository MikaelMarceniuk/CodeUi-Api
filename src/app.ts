import env from '@config/env'
import fastify, { FastifyInstance } from 'fastify'

class App {
  app: FastifyInstance

  async init() {
    this.app = fastify()
    await this.loadMiddlewares()
    await this.loadRoutes()
  }

  async listen() {
    await this.app.listen({ port: env.PORT })
    console.log(
      `====== HttpServer is up and running on port ${env.PORT} ======`
    )
  }

  async loadMiddlewares() {}

  async loadRoutes() {
    this.app.get('/api', (_, reply) => reply.send('Hello World!'))
  }
}

export default App
