import { Prisma, UserFavorite } from "@prisma/client";

interface IUserFavoriteRepository {
  findById(id: number): Promise<UserFavorite | null>
  save(data: Prisma.UserFavoriteUncheckedCreateInput): Promise<UserFavorite>
  delete(id: number): Promise<void>
}

export default IUserFavoriteRepository