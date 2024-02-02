import { Project } from "@prisma/client"
import IProjectRepository from "@repository/IProjectRepository"
import IUserRepository from "@repository/IUserRepository"
import ResourceAlreadyExistsError from "@useCases/errors/ResourceAlreadyExistsError"
import UserNotFoundError from "@useCases/errors/UserNotFoundError"

interface ICreateProjectUseCaseRequest {
  userId: string
  name: string
}

interface ICreateProjectUseCaseResponse {
  project: Project
}

class CreateProjectUseCase {
  constructor(
    private userRepo: IUserRepository,
    private projectRepo: IProjectRepository
  ) {}

  async execute(
    { userId, name }: ICreateProjectUseCaseRequest
  ): Promise<ICreateProjectUseCaseResponse> {
    const dbUser = await this.userRepo.findById(userId)
    if(!dbUser)
      throw new UserNotFoundError()

    const dbUserProjects = await this.projectRepo.getAllByOwnerId(userId)
    if(dbUserProjects.find(p => p.name == name))
      throw new ResourceAlreadyExistsError()

    const newProject = await this.projectRepo.saveWithGoogleAnalyticsService({
      name,
      owner_id: userId
    })

    return {
      project: newProject
    }
  }
}

export default CreateProjectUseCase
