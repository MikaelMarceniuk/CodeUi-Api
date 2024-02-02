import { Prisma, Project } from "@prisma/client";
import AllProjectInfo from "src/@types/AllProjectInfo";

interface IProjectRepository {
  findById(id: string): Promise<Project | null>
  getAllInfoById(id: string): Promise<AllProjectInfo>
  getAllByOwnerId(ownerId: string): Promise<Project[]>
  save(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  saveWithGoogleAnalyticsService(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  update(data: Prisma.ProjectUpdateInput): Promise<Project>
}

export default IProjectRepository