import { IUserSchema } from '@models/user'
import IUserRepository from '@repository/IUserRepository'
import bcrypt from 'bcrypt'
import { HydratedDocument } from 'mongoose'
import InvalidCredentialsError from './errors/InvalidCredentials'

interface IAuthUserRequest {
  email: string
  password: string
}

interface IAuthUserResponse {
  user: HydratedDocument<IUserSchema>
}

class AuthUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: IAuthUserRequest): Promise<IAuthUserResponse> {
    const dbUserByEmail = await this.userRepo.findByEmail(data.email)
    if (dbUserByEmail.length == 0) throw new InvalidCredentialsError()

    const isPasswordCorrect = await await bcrypt.compare(
      data.password,
      dbUserByEmail[0].password
    )
    if (!isPasswordCorrect) throw new InvalidCredentialsError()

    return {
      user: dbUserByEmail[0],
    }
  }
}

export default AuthUserUseCase
