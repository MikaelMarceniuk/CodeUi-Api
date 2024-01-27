import MongoDbUserRepo from '@repository/mongodb/mongoDbUserRepo'
import CreateUserUseCase from '@useCases/createUserUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

const createUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const parsedBody = userSchema.parse(req.body)

  await new CreateUserUseCase(new MongoDbUserRepo()).execute(parsedBody)

  rep.statusCode = 201
  rep.send()
}

export default createUserController
