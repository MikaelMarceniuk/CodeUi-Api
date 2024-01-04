import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid Environment variables!', _env.error.format())
  throw new Error('Invalid Environment variables')
}

export default _env.data
