import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import updateUserUseCase from '@useCases/userUseCase/updateUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const updateUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  const userSchema = z.object({
    username: z.string().optional(),
    contact: z.string().optional(),
    preferred_currency: z.string().optional()
  })

  const parsedBody = userSchema.parse(req.body)

  await new updateUserUseCase(new PrismaUserRepo()).execute({
    userId: req.user.id,
    data: parsedBody
  })

  rep.statusCode = 204
  rep.send()
}

export default updateUserController
