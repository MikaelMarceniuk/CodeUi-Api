import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma, UserFavorite } from "@prisma/client";
import IUserFavoriteRepository from "@repository/IUserFavoriteRepository";

class InMemoryUserFavoriteRepo implements IUserFavoriteRepository {
  async findById(id: number): Promise<UserFavorite | null> {
    const dbUserFav = await InMemoryPostgresql.getInstance().public.one(
      `select * from "UserFavorite" where "UserFavorite".id = ${id}`
    )
    return dbUserFav || null
  }

  async save(data: Prisma.UserFavoriteUncheckedCreateInput): Promise<UserFavorite> {
    const { count } = await InMemoryPostgresql.getInstance().public.one(`select count(*) from "UserFavorite"`)
    const newUserId = count + 1

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "UserFavorite" (id, user_id, name) values ('${newUserId}', '${data.user_id}', '${data.name}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "UserFavorite" where "UserFavorite".id = '${newUserId}'`)
  }

  async delete(id: number): Promise<void> {
    await InMemoryPostgresql.getInstance().public.query(
      `delete from "UserFavorite" where id = ${id}`
    )
  }
}

export default InMemoryUserFavoriteRepo