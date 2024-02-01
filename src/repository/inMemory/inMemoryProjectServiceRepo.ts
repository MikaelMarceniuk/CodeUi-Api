import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma } from "@prisma/client";
import IProjectServiceRepository from "@repository/IProjectServiceRepository";
import { randomUUID } from "node:crypto";

class InMemoryProjectServiceRepo implements IProjectServiceRepository {
  async findById(id: string) {
    const dbProjects = await InMemoryPostgresql.getInstance().public.one(
      `select * from "ProjectService" where "ProjectService".id = '${id}'`
    )
    return dbProjects || null
  }

  async getAllByProjectId(projectId: string) {
    return await InMemoryPostgresql.getInstance().public.many(
      `select * from "ProjectService" where "ProjectService".project_id = '${projectId}'`
    )
  }

  async save(data: Prisma.ProjectServiceUncheckedCreateInput) {
    const uuid = randomUUID()

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "ProjectService" (id, project_id, name, valor, start_date, end_date) values ('${uuid}', '${data.project_id}', '${data.name}', '${data.valor}', '${data.start_date}', '${data.end_date}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "ProjectService" where id = '${uuid}'`)    
  }
}

export default InMemoryProjectServiceRepo