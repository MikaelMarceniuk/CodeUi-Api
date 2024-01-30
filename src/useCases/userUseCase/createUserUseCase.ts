import { User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import hashUserPassword from '@utils/hashUserPassword'

interface ICreateUserRequest {
  email: string
  password: string
}

interface ICreateUserResponse {
  user: User
}

class CreateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: ICreateUserRequest): Promise<ICreateUserResponse> {
    const dbUser = await this.userRepo.findByEmail(data.email)
    if (dbUser)
      throw new Error('User with email')

    const newDbUser = await this.userRepo.save({
      username: data.email.split('@')[0],
      email: data.email,
      password_hash: await hashUserPassword(data.password),
    })

    return {
      user: newDbUser,
    }
  }
}

export default CreateUserUseCase
