import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import getUserInfoUseCase from '@useCases/userUseCase/getUserInfoUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

const getUserInfoController = async (req: FastifyRequest, rep: FastifyReply) => {
  const { user } = await new getUserInfoUseCase(new PrismaUserRepo()).execute({ userId: req.user.id})

  rep.statusCode = 200
  rep.send(user)
}

export default getUserInfoController
