import PrismaUserFavoriteRepo from '@repository/prisma/PrismaUserFavoriteRepo'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import createUserFavoriteUseCase from '@useCases/userFavoriteUseCase/createUserFavoriteUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createUserFavoriteController = async (req: FastifyRequest, rep: FastifyReply) => {
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
}

export default createUserFavoriteController
