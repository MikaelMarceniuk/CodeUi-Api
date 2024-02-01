import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import UpdateUserPlanUseCase from '@useCases/userUseCase/updateUserPlanUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const updateUserPlanController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const planSchema = z.object({
      plan: z.enum(['FREE', 'PRO'])
    })
  
    const { plan } = planSchema.parse(req.body)
  
    await new UpdateUserPlanUseCase(new PrismaUserRepo()).execute({
      userId: req.user.id,
      plan
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

export default updateUserPlanController
