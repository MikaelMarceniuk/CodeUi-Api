import { FastifyInstance } from "fastify";
import jwtValidator from "src/http/middlewares/jwtValidator";
import createUserFavoriteController from "./createUserFavoriteController";
import deleteUserFavoriteController from "./deleteUserFavoriteController";

const userFavoriteRouter = async (app: FastifyInstance) => {
  app.addHook("onRequest", jwtValidator)

  app.post('/', createUserFavoriteController)
  app.delete('/:id', deleteUserFavoriteController)
}

export default userFavoriteRouter