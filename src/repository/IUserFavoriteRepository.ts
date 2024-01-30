import { Prisma, UserFavorite } from "@prisma/client";

interface IUserFavoriteRepository {
  save(data: Prisma.UserFavoriteUncheckedCreateInput): Promise<UserFavorite>
  delete(id: string): Promise<void>
}

export default IUserFavoriteRepository