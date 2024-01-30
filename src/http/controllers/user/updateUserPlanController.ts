import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UpdateUserPlanUseCase from '@useCases/userUseCase/updateUserPlanUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const updateUserPlanController = async (req: FastifyRequest, rep: FastifyReply) => {
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
}

export default updateUserPlanController
