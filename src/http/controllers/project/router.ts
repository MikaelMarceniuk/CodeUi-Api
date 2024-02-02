import { FastifyInstance } from 'fastify'
import jwtValidator from 'src/http/middlewares/jwtValidator'
import createProjectController from './createProjectController'

const projectRouter = async (app: FastifyInstance) => {
  app.addHook('onRequest', jwtValidator)

  app.post('/', createProjectController)
}

export default projectRouter
