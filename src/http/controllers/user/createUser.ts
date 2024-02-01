import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UserAlreadyExistsError from '@useCases/errors/UserAlreadyExists'
import CreateUserUseCase from '@useCases/userUseCase/createUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })
  
    const parsedBody = userSchema.parse(req.body)
  
    await new CreateUserUseCase(new PrismaUserRepo()).execute(parsedBody)
  
    rep.statusCode = 201
    rep.send()
  } catch(e) {
    if(e instanceof UserAlreadyExistsError) {
      rep.statusCode = 403
      return rep.send({ message: e.message })
    }

    throw e
  }
}

export default createUserController
