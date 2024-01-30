import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import authUserUseCase from '@useCases/userUseCase/authUserUseCase'
import InvalidCredentialsError from '@useCases/errors/InvalidCredentials'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'

const authUserController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const parsedBody = userSchema.parse(req.body)

    const { user } = await new authUserUseCase(new PrismaUserRepo()).execute(
      parsedBody
    )

    const accessToken = await rep.jwtSign(
      {},
      { sign: { sub: user.id, expiresIn: '10m' } }
    )

    rep.statusCode = 200
    rep.send({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      rep.statusCode = 404
      rep.send({ isSuccess: false, message: e.message })
    }

    throw e
  }
}

export default authUserController
