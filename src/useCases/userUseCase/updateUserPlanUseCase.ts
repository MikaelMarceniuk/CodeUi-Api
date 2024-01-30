import { Plans, User } from '@prisma/client'
import IUserRepository from '@repository/IUserRepository'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'

interface IUpdateUserPlanRequest {
  userId: string
  plan: Plans
}

interface IUpdateUserPlanResponse {
  user: User
}

class UpdateUserPlanUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute({ userId, plan }: IUpdateUserPlanRequest): Promise<IUpdateUserPlanResponse> {
    let dbUser = await this.userRepo.findById(userId)
    if(!dbUser)
      throw new UserNotFoundError()

    dbUser = await this.userRepo.update(userId, { plan })
    
    return {
      user: dbUser
    }
  }
}

export default UpdateUserPlanUseCase
