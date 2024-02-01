import PrismaUserFavoriteRepo from '@repository/prisma/PrismaUserFavoriteRepo'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UserFavoriteLimitError from '@useCases/errors/UserFavoriteLimitError'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import createUserFavoriteUseCase from '@useCases/userFavoriteUseCase/createUserFavoriteUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createUserFavoriteController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userFavSchema = z.object({
      name: z.string()
    })
  
    const { name } = userFavSchema.parse(req.body)
  
    await new createUserFavoriteUseCase(
      new PrismaUserRepo(),
      new PrismaUserFavoriteRepo()
    ).execute({
      userId: req.user.id,
      name: name
    })
  
    rep.statusCode = 201
    rep.send()
  } catch(e) {
    if(e instanceof UserNotFoundError) {
      rep.statusCode = 404
      return rep.send({ message: e.message })
    }

    if(e instanceof UserFavoriteLimitError) {
      rep.statusCode = 403
      return rep.send({ message: e.message })
    }

    throw e
  }
}

export default createUserFavoriteController
