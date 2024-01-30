import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma, User } from "@prisma/client";
import IUserRepository from "@repository/IUserRepository";
import { randomUUID } from "node:crypto";

class InMemoryUserRepo implements IUserRepository {
  async findById(id: string) {
    const dbUser = await InMemoryPostgresql.getInstance().public.one(`select * from "User" where "User".id = '${id}'`)
    return dbUser || null
  }

  async findByEmail(email: string) {
    const dbUser = await InMemoryPostgresql.getInstance().public.one(`select * from "User" where "User".email = '${email}'`)
    return dbUser || null
  }

  async save(data: Prisma.UserCreateInput): Promise<User> {
    const uuid = randomUUID()

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "User" (id, username, email, password_hash, created_at) values ('${uuid}', '${data.username}', '${data.email}', '${data.password_hash}', '${new Date().toJSON()}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "User" where "User".id = '${uuid}'`)
  }

  async getAllInfoById(id: string) {
    const dbUser = await this.findById(id)
    if(!dbUser)
      return null

    dbUser.favorites = await InMemoryPostgresql.getInstance().public.many(
      `select * from "UserFavorite" where "UserFavorite".user_id = '${dbUser.id}'`
    )

    return dbUser
  }

  async update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    await InMemoryPostgresql.getInstance().public.query(
      `update
        "User"
      set
        username = '${data.username}',
        email = '${data.email}',
        contact = '${data.contact}',
        avatar = '${data.avatar}',
        preferred_currency = '${data.preferred_currency}'
      where
        "User".id = '${id}'`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "User" where "User".id = '${id}'`)
  }
}

export default InMemoryUserRepo