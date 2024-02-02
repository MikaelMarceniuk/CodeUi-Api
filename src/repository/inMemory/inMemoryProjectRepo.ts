import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma, Project } from "@prisma/client";
import IProjectRepository from "@repository/IProjectRepository";
import moment from "moment";
import { randomUUID } from "node:crypto";

class InMemoryProjectRepo implements IProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const dbProject = await InMemoryPostgresql.getInstance().public.one(
      `select * from "Project" where "Project".id = '${id}'`
    )
    return dbProject || null
  }

  async getAllByOwnerId(ownerId: string): Promise<Project[]> {
    const dbProjects = await InMemoryPostgresql.getInstance().public.many(
      `select * from "Project" where "Project".owner_id = '${ownerId}'`
    )
    return dbProjects || null
  }

  async save(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const uuid = randomUUID()

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "Project" (id, owner_id, name, created_at) values ('${uuid}', '${data.owner_id}', '${data.name}', '${new Date().toJSON()}')`
    )

    return await InMemoryPostgresql.getInstance().public.one(`select * from "Project" where id = '${uuid}'`)
  }

  async saveWithGoogleAnalyticsService(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const project = await this.save(data)

    await InMemoryPostgresql.getInstance().public.query(
      `insert into "ProjectService" (id, project_id, name, valor, start_date, end_date) values ('${randomUUID()}', '${project.id}', 'Google Analytics', '10', '${moment().format('YYYY-MM-DD')}', '${moment('9999-01-01').format('YYYY-MM-DD')}')`
    )

    return project
  }
}

export default InMemoryProjectRepo