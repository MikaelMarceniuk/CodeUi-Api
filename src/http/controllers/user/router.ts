import { FastifyInstance } from 'fastify'
import jwtValidator from 'src/http/middlewares/jwtValidator'
import authUserController from './authUser'
import createUserController from './createUser'
import getUserInfoController from './getUserInfo'
import updateUserController from './updateUser'
import updateUserPlanController from './updateUserPlanController'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
  app.post('/session', authUserController)

  app.get('/', { onRequest: [jwtValidator] }, getUserInfoController)
  app.put('/', { onRequest: [jwtValidator] }, updateUserController)
  app.patch('/plan', { onRequest: [jwtValidator] }, updateUserPlanController)
}

export default userRouter
