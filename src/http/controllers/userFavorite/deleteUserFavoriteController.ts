import PrismaUserFavoriteRepo from '@repository/prisma/PrismaUserFavoriteRepo'
import deleteUserFavoriteUseCase from '@useCases/userFavoriteUseCase/deleteUserFavoriteUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const deleteUserFavoriteController = async (req: FastifyRequest, rep: FastifyReply) => {
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

  rep.statusCode = 200
  rep.send()
}

export default deleteUserFavoriteController
