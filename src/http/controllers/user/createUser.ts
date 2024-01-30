import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import CreateUserUseCase from '@useCases/userUseCase/createUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const parsedBody = userSchema.parse(req.body)

  await new CreateUserUseCase(new PrismaUserRepo()).execute(parsedBody)

  rep.statusCode = 201
  rep.send()
}

export default createUserController
