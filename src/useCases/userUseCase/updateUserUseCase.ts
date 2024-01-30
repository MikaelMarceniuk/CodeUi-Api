import { User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'

interface IUpdateUserRequest {
  username: string
  contact: string
  avatar: string
  preferred_currency: string
}

interface IUpdateUserResponse {
  user: User
}

class UpdateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, data: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    let dbUser = await this.userRepo.findById(userId)
    if(!dbUser)
      throw new UserNotFoundError()

    dbUser = await this.userRepo.update(
      userId,
      {
        ...dbUser,
        username: data.username,
        contact: data.contact,
        avatar: data.avatar,
        preferred_currency: data.preferred_currency
      }
    )
    
    return {
      user: dbUser
    }
  }
}

export default UpdateUserUseCase
