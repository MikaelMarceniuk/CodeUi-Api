import { FastifyRequest, FastifyReply } from 'fastify'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import getUserInfoUseCase from '@useCases/userUseCase/getUserInfoUseCase'

const getUserInfoController = async (req: FastifyRequest, rep: FastifyReply) => {
  const { user } = await new getUserInfoUseCase(new PrismaUserRepo()).execute({ userId: req.user.id})

  rep.statusCode = 200
  rep.send(user)
}

export default getUserInfoController
