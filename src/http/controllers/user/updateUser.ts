import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import updateUserUseCase from '@useCases/userUseCase/updateUserUseCase'

const updateUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  const userSchema = z.object({
    username: z.string(),
    contact: z.string(),
    avatar: z.string(),
    preferred_currency: z.string()
  })

  const parsedBody = userSchema.parse(req.body)

  await new updateUserUseCase(new PrismaUserRepo()).execute(req.user.id, parsedBody)

  rep.statusCode = 204
  rep.send()
}

export default updateUserController
