import { IUserSchema } from '@models/user'
import IUserRepository from '@repository/IUserRepository'
import doesPasswordHashMatchPassword from '@utils/doesPasswordHashMatchPassword'
import { HydratedDocument } from 'mongoose'

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
    // TODO Handle Errors

    const dbUserByEmail = await this.userRepo.findByEmail(data.email)
    if (dbUserByEmail.length == 0) {
      throw new Error('No user found with email')
    }

    const isPasswordCorrect = await doesPasswordHashMatchPassword(
      data.password,
      dbUserByEmail[0].password
    )
    if (!isPasswordCorrect) {
      throw new Error('Password not valid')
    }

    return {
      user: dbUserByEmail[0],
    }
  }
}

export default AuthUserUseCase
