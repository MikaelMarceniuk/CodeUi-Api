import { Project } from "@prisma/client"
import IProjectRepository from "@repository/IProjectRepository"
import NoPermitionError from "@useCases/errors/NoPermitionError"

interface IUpdateProjectUseCaseRequest {
  userId: string
  projectId: string
  data: {
    name?: string
    analyticsCode?: string
  }
}

interface IUpdateProjectUseCaseResponse {
  project: Project
}

class UpdateProjectUseCase {
  constructor(
    private projectRepo: IProjectRepository
  ) {}

  async execute(
    { userId, projectId, data }: IUpdateProjectUseCaseRequest
  ): Promise<IUpdateProjectUseCaseResponse> {
    const dbUserProjects = await this.projectRepo.getAllByOwnerId(userId)
    const dbUserProj = dbUserProjects.find(p => p.id == projectId)
    if(!dbUserProj)
      throw new NoPermitionError()

    return {
      project: await this.projectRepo.update({
        id: projectId,
        name: data.name || dbUserProj.name,
        analytics_code: data.analyticsCode || dbUserProj.analytics_code,
      })
    }
  }
}

export default UpdateProjectUseCase
