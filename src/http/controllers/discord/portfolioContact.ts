import env from '@config/env'
import Discord from '@libs/discord'
import ResendLib from '@libs/resend'
import PrismaPortfolioContactRepo from '@repository/prisma/PrismaPortfolioContactRepo'
import NotifyDiscordUseCase from '@useCases/notifyDiscordUseCase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const portfolioContactDiscordController = async (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    mobileNumber: z.string(),
    hearAboutUs: z.string(),
    aboutProject: z.string(),
    wayOfContact: z.string(),
  })

  const parsedBody = userSchema.parse(req.body)

  await new NotifyDiscordUseCase(
    new PrismaPortfolioContactRepo(),
    new Discord(),
    new ResendLib()
  ).execute(parsedBody, env.LOGS_PORTFOLIO)

  rep.statusCode = 201
  rep.send()
}

export default portfolioContactDiscordController
