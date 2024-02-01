import { FastifyInstance } from 'fastify'
import jwtValidator from 'src/http/middlewares/jwtValidator'
import authUserController from './authUser'
import createUserController from './createUser'
import createUserFavoriteController from './createUserFavoriteController'
import deleteUserFavoriteController from './deleteUserFavoriteController'
import getUserInfoController from './getUserInfo'
import updateUserAvatarController from './updateUserAvatarController'
import updateUserController from './updateUserController'
import updateUserPlanController from './updateUserPlanController'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
  app.post('/session', authUserController)

  app.get('/', { onRequest: [jwtValidator] }, getUserInfoController)
  app.put('/', { onRequest: [jwtValidator] }, updateUserController)
  app.patch('/plan', { onRequest: [jwtValidator] }, updateUserPlanController)

  app.post('/favorite', { onRequest: [jwtValidator] }, createUserFavoriteController)
  app.delete('/favorite/:id', { onRequest: [jwtValidator] }, deleteUserFavoriteController)

  app.patch('/avatar', { onRequest: [jwtValidator] }, updateUserAvatarController)
}

export default userRouter
