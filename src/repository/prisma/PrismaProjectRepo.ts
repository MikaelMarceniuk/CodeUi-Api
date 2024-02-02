import Postgresql from "@libs/postgresql";
import { Prisma } from "@prisma/client";
import IProjectRepository from "@repository/IProjectRepository";
import moment from "moment";

class PrismaProjectRepo implements IProjectRepository {
	async findById(id: string) {
    return Postgresql.getInstance().project.findUnique({ where: { id }})
  }

  async getAllByOwnerId(ownerId: string) {
    return Postgresql.getInstance().project.findMany({ where: { owner_id: ownerId } })
  }

  async save(data: Prisma.ProjectUncheckedCreateInput) {
    return Postgresql.getInstance().project.create({ data })
  }

  async saveWithGoogleAnalyticsService(data: Prisma.ProjectUncheckedCreateInput) {
    return Postgresql.getInstance().project.create({
      data: {
        name: data.name,
        owner_id: data.owner_id,
        ProjectService: {
          create: {
            name: 'Google Analytics',
            valor: '10',
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment('9999-01-01').format('YYYY-MM-DD')
          }
        }
      }
    })
  }
}

export default PrismaProjectRepo