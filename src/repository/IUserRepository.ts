import { Prisma, User } from '@prisma/client'

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  save(data: Prisma.UserCreateInput): Promise<User>
}

export default IUserRepository
