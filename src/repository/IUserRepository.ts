import { Prisma, User } from '@prisma/client'

interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(data: Prisma.UserCreateInput): Promise<User>
  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
}

export default IUserRepository
