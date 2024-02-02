import IUserRepository from '@repository/IUserRepository'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import AllUserInfo from 'src/@types/AllUserInfo'

interface IGetUserInfoRequest {
  userId: string
}

interface IGetUserInfoResponse {
  user: AllUserInfo
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
