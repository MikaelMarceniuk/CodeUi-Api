import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma } from "@prisma/client";
import IProjectRepository from "@repository/IProjectRepository";
import { randomUUID } from "node:crypto";

class InMemoryProjectRepo implements IProjectRepository {
  async getAllByOwnerId(ownerId: string) {
    const dbProjects = await InMemoryPostgresql.getInstance().public.many(
      `select * from "Project" where "Project".owner_id = '${ownerId}'`
    )
    return dbProjects || null
  }

  async save(data: Prisma.ProjectUncheckedCreateInput) {
    const uuid = randomUUID()

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "Project" (id, owner_id, name, created_at) values ('${uuid}', '${data.owner_id}', '${data.name}', '${new Date().toJSON()}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "Project" where id = '${uuid}'`)
  }
}

export default InMemoryProjectRepo