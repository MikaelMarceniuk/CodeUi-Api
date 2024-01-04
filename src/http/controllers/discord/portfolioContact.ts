import env from '@config/env'
import Discord from '@libs/discord'
import NotifyDiscordUseCase from '@useCases/notifyDiscordUseCase'
import { FastifyRequest, FastifyReply } from 'fastify'
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
    aboutCustomerProject: z.string(),
  })

  const parsedBody = userSchema.parse(req.body)

  await new NotifyDiscordUseCase(new Discord()).execute(
    parsedBody,
    env.LOGS_PORTFOLIO
  )

  rep.statusCode = 201
  rep.send()
}

export default portfolioContactDiscordController
