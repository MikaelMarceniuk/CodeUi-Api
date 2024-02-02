import PrismaProjectRepo from '@repository/prisma/PrismaProjectRepo'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import InvalidCredentialsError from '@useCases/errors/InvalidCredentials'
import CreateProjectUseCase from '@useCases/projectUseCase/createProjectUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const createProjectController = async (req: FastifyRequest, rep: FastifyReply) => {
  try {
    const projectSchema = z.object({
      name: z.string(),
    })

    const { name } = projectSchema.parse(req.body)

    await new CreateProjectUseCase(
      new PrismaUserRepo(),
      new PrismaProjectRepo()
    ).execute({
      userId: req.user.id,
      name
    })

    rep.statusCode = 201
    rep.send()
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      rep.statusCode = 404
      rep.send({ isSuccess: false, message: e.message })
    }

    throw e
  }
}

export default createProjectController
