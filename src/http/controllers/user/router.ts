import { FastifyInstance } from 'fastify'
import createUserController from './createUser'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
}

export default userRouter
