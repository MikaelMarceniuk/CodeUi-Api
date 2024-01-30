import { User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import bcrypt from 'bcrypt'
import InvalidCredentialsError from '../errors/InvalidCredentials'

interface IAuthUserRequest {
  email: string
  password: string
}

interface IAuthUserResponse {
  user: User
}

class AuthUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: IAuthUserRequest): Promise<IAuthUserResponse> {
    const dbUser = await this.userRepo.findByEmail(data.email)
    if (!dbUser) throw new InvalidCredentialsError()

    const isPasswordCorrect = await await bcrypt.compare(
      data.password,
      dbUser.password_hash
    )
    if (!isPasswordCorrect) throw new InvalidCredentialsError()

    return {
      user: dbUser,
    }
  }
}

export default AuthUserUseCase
