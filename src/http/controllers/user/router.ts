import { FastifyInstance } from 'fastify'
import createUserController from './createUser'
import authUserController from './authUser'
import updateUserController from './updateUser'
import jwtValidator from 'src/http/middlewares/jwtValidator'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
  app.post('/session', authUserController)

  app.put('/', { onRequest: [jwtValidator] }, updateUserController)
}

export default userRouter
