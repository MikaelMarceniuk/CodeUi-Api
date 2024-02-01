import { Prisma, Project } from "@prisma/client";

interface IProjectRepository {
  getAllByOwnerId(ownerId: string): Promise<Project[]>
  save(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
}

export default IProjectRepository