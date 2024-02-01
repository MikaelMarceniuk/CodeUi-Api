import { UserFavorite } from "@prisma/client"
import IUserFavoriteRepository from "@repository/IUserFavoriteRepository"
import IUserRepository from "@repository/IUserRepository"
import UserFavoriteLimitError from "@useCases/errors/UserFavoriteLimitError"
import UserNotFoundError from "@useCases/errors/UserNotFoundError"

interface ICreateUserFavoriteRequest {
  userId: string
  name: string
}

interface ICreateUserFavoriteResponse {
  userFavorite: UserFavorite
}

class CreateUserFavoriteUseCase {
  constructor(
    private userRepo: IUserRepository,
    private userFavoriteRepo: IUserFavoriteRepository
  ) {}

  async execute(
    { name, userId }: ICreateUserFavoriteRequest
  ): Promise<ICreateUserFavoriteResponse> {
    const dbUser = await this.userRepo.getAllInfoById(userId)
    if(!dbUser)
      throw new UserNotFoundError()

    if(dbUser.favorites.length == 3)
      throw new UserFavoriteLimitError()

    const dbUserFavorite = await this.userFavoriteRepo.save({
      user_id: userId,
      name
    })

    return {
      userFavorite: dbUserFavorite
    }
  }
}

export default CreateUserFavoriteUseCase
