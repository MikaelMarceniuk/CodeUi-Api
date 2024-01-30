import { User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'

interface IGetUserInfoRequest {
  userId: string
}

interface IGetUserInfoResponse {
  user: User
}

class GetUserInfoUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute({ userId }: IGetUserInfoRequest): Promise<IGetUserInfoResponse> {
    let dbUser = await this.userRepo.getAllInfoById(userId)
    if(!dbUser)
      throw new UserNotFoundError()
    
    return {
      user: dbUser
    }
  }
}

export default GetUserInfoUseCase
