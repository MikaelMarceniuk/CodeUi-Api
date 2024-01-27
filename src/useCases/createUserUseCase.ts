import { IUserSchema } from '@models/user'
import IUserRepository from '@repository/IUserRepository'
import hashUserPassword from '@utils/hashUserPassword'
import { HydratedDocument } from 'mongoose'

interface ICreateUserRequest {
  email: string
  password: string
}

interface ICreateUserResponse {
  user: HydratedDocument<IUserSchema>
}

class CreateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: ICreateUserRequest): Promise<ICreateUserResponse> {
    const dbUserByEmail = await this.userRepo.findByEmail(data.email)
    if (dbUserByEmail.length > 0) {
      throw new Error('User with email')
    }

    const dbUser = await this.userRepo.save({
      email: data.email,
      password: await hashUserPassword(data.password),
    })

    return {
      user: dbUser,
    }
  }
}

export default CreateUserUseCase
