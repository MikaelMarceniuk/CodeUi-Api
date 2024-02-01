import { FastifyInstance } from 'fastify'
import jwtValidator from 'src/http/middlewares/jwtValidator'
import authUserController from './authUserController'
import createUserController from './createUser'
import createUserFavoriteController from './createUserFavoriteController'
import deleteUserFavoriteController from './deleteUserFavoriteController'
import getUserInfoController from './getUserInfoController'
import refreshTokenController from './refreshtokenController'
import updateUserAvatarController from './updateUserAvatarController'
import updateUserController from './updateUserController'
import updateUserPlanController from './updateUserPlanController'

const userRouter = async (app: FastifyInstance) => {
  app.post('/', createUserController)
  app.post('/session', authUserController)
  app.post('/session/refresh', refreshTokenController)

  app.get('/', { onRequest: [jwtValidator] }, getUserInfoController)
  app.put('/', { onRequest: [jwtValidator] }, updateUserController)
  app.patch('/plan', { onRequest: [jwtValidator] }, updateUserPlanController)
  app.patch('/avatar', { onRequest: [jwtValidator] }, updateUserAvatarController)

  app.post('/favorite', { onRequest: [jwtValidator] }, createUserFavoriteController)
  app.delete('/favorite/:id', { onRequest: [jwtValidator] }, deleteUserFavoriteController)
}

export default userRouter
