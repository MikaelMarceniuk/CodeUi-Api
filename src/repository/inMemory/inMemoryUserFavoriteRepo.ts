import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma } from "@prisma/client";
import IUserFavoriteRepository from "@repository/IUserFavoriteRepository";

class InMemoryUserFavoriteRepo implements IUserFavoriteRepository {
  async save(data: Prisma.UserFavoriteUncheckedCreateInput) {
    const { count } = await InMemoryPostgresql.getInstance().public.one(`select count(*) from "UserFavorite"`)
    const newUserId = count + 1

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "UserFavorite" (id, user_id, name) values ('${newUserId}', '${data.user_id}', '${data.name}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "UserFavorite" where "UserFavorite".id = '${newUserId}'`)
  }

  async delete(id: string): Promise<void> {
    
  }
}

export default InMemoryUserFavoriteRepo