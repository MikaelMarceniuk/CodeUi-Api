import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import CreateUserUseCase from '@useCases/userUseCase/createUserUseCase'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'

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
