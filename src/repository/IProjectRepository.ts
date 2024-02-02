import { Prisma, Project } from "@prisma/client";

interface IProjectRepository {
  findById(id: string): Promise<Project | null>
  getAllByOwnerId(ownerId: string): Promise<Project[]>
  save(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  saveWithGoogleAnalyticsService(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
}

export default IProjectRepository