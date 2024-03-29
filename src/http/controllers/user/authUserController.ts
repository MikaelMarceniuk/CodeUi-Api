import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import InvalidCredentialsError from '@useCases/errors/InvalidCredentials'
import authUserUseCase from '@useCases/userUseCase/authUserUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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
      { id: user.id },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    )

    const refreshToken = await rep.jwtSign(
      { id: user.id },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    )

    rep.statusCode = 200
    rep
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({
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
