import { FastifyInstance } from 'fastify'
import createUserController from './createUser'
import authUserController from './authUser'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
  app.post('/session', authUserController)
}

export default userRouter
