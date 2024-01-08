import MongoDbUserRepo from '@repository/mongodb/mongoDbUserRepo'
import authUserUseCase from '@useCases/authUserUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

const authUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const parsedBody = userSchema.parse(req.body)

  const { user } = await new authUserUseCase(new MongoDbUserRepo()).execute(
    parsedBody
  )

  // TODO Create JWT

  rep.statusCode = 200
  rep.send({
    accessToken: '',
    user: {
      id: user.id,
      email: user.email,
    },
  })
}

export default authUserController
