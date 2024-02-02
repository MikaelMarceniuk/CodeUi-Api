import InMemoryPostgresql from "@libs/inMemoryPostgres";
import { Prisma, Project, ProjectService } from "@prisma/client";
import IProjectRepository from "@repository/IProjectRepository";
import moment from "moment";
import { randomUUID } from "node:crypto";
import AllProjectInfo from "src/@types/AllProjectInfo";

class InMemoryProjectRepo implements IProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const dbProject = await InMemoryPostgresql.getInstance().public.one(
      `select * from "Project" where "Project".id = '${id}'`
    )
    return dbProject || null
  }

  async getAllInfoById(id: string): Promise<AllProjectInfo> {
    const dbProject = await this.findById(id) as Project

    return {
      ...dbProject,
      services: await InMemoryPostgresql.getInstance().public.many(
        `select * from "ProjectService" where "ProjectService".project_id = '${dbProject?.id}'`
      ) as ProjectService[]
    }
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

  async update(data: Prisma.ProjectUpdateInput): Promise<Project> {
    await InMemoryPostgresql.getInstance().public.query(
      `update "Project" set "name" = '${data.name}', analytics_code = '${data.analytics_code}' where "Project".id = '${data.id}'`
    )

    return await this.findById(data.id as string) as Project
  }

  async softDelete(id: string): Promise<void> {
    await InMemoryPostgresql.getInstance().public.query(
      `update "Project" set is_deleted = true, deleted_at = '${new Date().toJSON()}' where "Project".id = '${id}'`
    )
  }
}

export default InMemoryProjectRepo