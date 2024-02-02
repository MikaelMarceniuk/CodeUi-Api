import { Project } from "@prisma/client"
import IProjectRepository from "@repository/IProjectRepository"

interface IGetProjectsByUserUseCaseRequest {
  userId: string
}

interface IGetProjectsByUserUseCaseResponse {
  projects: Project[]
}

class GetProjectsByUserUseCase {
  constructor(
    private projectRepo: IProjectRepository
  ) {}

  async execute(
    { userId }: IGetProjectsByUserUseCaseRequest
  ): Promise<IGetProjectsByUserUseCaseResponse> {
    return {
      projects: await this.projectRepo.getAllByOwnerId(userId)
    }
  }
}

export default GetProjectsByUserUseCase
