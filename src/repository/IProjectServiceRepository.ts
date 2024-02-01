import { Prisma, ProjectService } from "@prisma/client";

interface IProjectServiceRepository {
  findById(id: string): Promise<ProjectService | null>
  getAllByProjectId(projectId: string): Promise<ProjectService[]>
  save(data: Prisma.ProjectServiceUncheckedCreateInput): Promise<ProjectService>
}

export default IProjectServiceRepository