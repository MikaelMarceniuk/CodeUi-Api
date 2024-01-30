import Postgresql from "@libs/postgresql";
import { Prisma } from "@prisma/client";
import IUserFavoriteRepository from "@repository/IUserFavoriteRepository";

class PrismaUserFavoriteRepo implements IUserFavoriteRepository {
  async findById(id: number) {
    return await Postgresql.getInstance().userFavorite.findUnique({ where: { id } })
  }

  async save(data: Prisma.UserFavoriteUncheckedCreateInput) {
    return await Postgresql.getInstance().userFavorite.create({ data })
  }

  async delete(id: number) {
    await Postgresql.getInstance().userFavorite.delete({ where: { id } })
  }
}

export default PrismaUserFavoriteRepo