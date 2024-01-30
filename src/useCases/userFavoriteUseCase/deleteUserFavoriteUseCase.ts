import IUserFavoriteRepository from "@repository/IUserFavoriteRepository"

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
      throw new Error('Resource not found.')

    if(userFavorites.user_id != userId)
      throw new Error('Not enough permission.')

    await this.userFavoriteRepo.delete(userFavoriteId)
  }
}

export default DeleteUserFavoriteUseCase
