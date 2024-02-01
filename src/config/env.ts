import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['PRD', 'DEV', 'test']).default('DEV'),
  PORT: z.coerce.number().default(3333),
  DISCORD_TOKEN: z.string(),
  LOGS_PORTFOLIO: z.string(),
  RESEND_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_PROJECT_ID: z.string(),
  GOOGLE_STORAGE_EMAIL: z.string(),
  GOOGLE_STORAGE_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid Environment variables!', _env.error.format())
  throw new Error('Invalid Environment variables')
}

export default _env.data
