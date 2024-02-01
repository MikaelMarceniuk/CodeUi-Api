import IUserFavoriteRepository from "@repository/IUserFavoriteRepository"
import NoPermitionError from "@useCases/errors/NoPermitionError"
import UserFavoriteNotFoundError from "@useCases/errors/UserFavoriteNotFoundError"

interface IDeleteUserFavoriteRequest {
  userId: string
  userFavoriteId: number
}

class DeleteUserFavoriteUseCase {
  constructor(
    private userFavoriteRepo: IUserFavoriteRepository
  ) {}

  async execute(
    {
      userId,
      userFavoriteId
    }: IDeleteUserFavoriteRequest
  ): Promise<void> {
    const userFavorites = await this.userFavoriteRepo.findById(userFavoriteId)
    if(!userFavorites)
      throw new UserFavoriteNotFoundError()

    if(userFavorites.user_id != userId)
      throw new NoPermitionError()

    await this.userFavoriteRepo.delete(userFavoriteId)
  }
}

export default DeleteUserFavoriteUseCase
