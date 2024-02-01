import { Currency, User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'

interface IUpdateUserRequest {
  userId: string
  data: {
    username?: string
    contact?: string
    preferred_currency?: Currency
  }
}

interface IUpdateUserResponse {
  user: User
}

class UpdateUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute({
    userId,
    data
  }: IUpdateUserRequest): Promise<IUpdateUserResponse> {
    let dbUser = await this.userRepo.findById(userId)
    if(!dbUser)
      throw new UserNotFoundError()

    dbUser = await this.userRepo.update(
      userId,
      {
        username: data.username || dbUser.username,
        contact: data.contact || dbUser.contact,
        preferred_currency: data.preferred_currency || dbUser.preferred_currency
      }
    )
    
    return {
      user: dbUser
    }
  }
}

export default UpdateUserUseCase
