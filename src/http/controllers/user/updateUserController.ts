import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import updateUserUseCase from '@useCases/userUseCase/updateUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const updateUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userSchema = z.object({
      username: z.string().optional(),
      contact: z.string().optional(),
      preferred_currency: z.enum(['BRL', 'USD', 'EUR']).optional()
    })
  
    const parsedBody = userSchema.parse(req.body)
  
    await new updateUserUseCase(new PrismaUserRepo()).execute({
      userId: req.user.id,
      data: parsedBody
    })
  
    rep.statusCode = 204
    rep.send()
  } catch(e) {
    if(e instanceof UserNotFoundError) {
      rep.statusCode = 404
      return rep.send({ message: e.message })
    }

    throw e
  }
}

export default updateUserController
