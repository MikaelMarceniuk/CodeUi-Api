import PrismaUserFavoriteRepo from '@repository/prisma/PrismaUserFavoriteRepo'
import NoPermitionError from '@useCases/errors/NoPermitionError'
import UserFavoriteNotFoundError from '@useCases/errors/UserFavoriteNotFoundError'
import deleteUserFavoriteUseCase from '@useCases/userFavoriteUseCase/deleteUserFavoriteUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteUserFavoriteController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const paramsSchema = z.object({
      id: z.coerce.number()
    })
  
    const { id } = paramsSchema.parse(req.params)
  
    await new deleteUserFavoriteUseCase(
      new PrismaUserFavoriteRepo()
    ).execute({
      userId: req.user.id,
      userFavoriteId: id
    })
  
    rep.statusCode = 204
    rep.send()
  } catch(e) {
    if(e instanceof UserFavoriteNotFoundError) {
      rep.statusCode = 404
      return rep.send({ message: e.message })
    }

    if(e instanceof NoPermitionError) {
      rep.statusCode = 403
      return rep.send({ message: e.message })
    }

    throw e
  }
}

export default deleteUserFavoriteController
