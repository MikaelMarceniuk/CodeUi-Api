import IProjectRepository from "@repository/IProjectRepository"
import NoPermitionError from "@useCases/errors/NoPermitionError"
import AllProjectInfo from "src/@types/AllProjectInfo"

interface IGetProjectInfoUseCaseRequest {
  userId: string
  projectId: string
}

interface IGetProjectInfoUseCaseResponse {
  project: AllProjectInfo
}

class GetProjectInfoUseCase {
  constructor(
    private projectRepo: IProjectRepository
  ) {}

  async execute(
    { userId, projectId }: IGetProjectInfoUseCaseRequest
  ): Promise<IGetProjectInfoUseCaseResponse> {
    const dbUserProjects = await this.projectRepo.getAllByOwnerId(userId)
    if(!dbUserProjects.find(p => p.id == projectId))
      throw new NoPermitionError()

    return {
      project: await this.projectRepo.getAllInfoById(projectId)
    }
  }
}

export default GetProjectInfoUseCase
