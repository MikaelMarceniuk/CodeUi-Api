import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import getUserInfoUseCase from '@useCases/userUseCase/getUserInfoUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'

const getUserInfoController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const { user } = await new getUserInfoUseCase(new PrismaUserRepo()).execute({ userId: req.user.id})

    rep.statusCode = 200
    rep.send(user)
  } catch(e) {
    if(e instanceof UserNotFoundError) {
      rep.statusCode = 404
      return rep.send({ message: e.message })
    }

    throw e
  }
}

export default getUserInfoController
