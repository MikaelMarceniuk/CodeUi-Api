import { Prisma, User } from '@prisma/client'
import AllUserInfo from 'src/@types/AllUserInfo'

interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  getAllInfoById(id: string): Promise<AllUserInfo | null>
  save(data: Prisma.UserCreateInput): Promise<User>
  update(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
}

export default IUserRepository
