import IProjectRepository from "@repository/IProjectRepository"
import NoPermitionError from "@useCases/errors/NoPermitionError"

interface IDeleteProjectUseCaseRequest {
  userId: string
  projectId: string
}

class DeleteProjectUseCase {
  constructor(
    private projectRepo: IProjectRepository
  ) {}

  async execute(
    { userId, projectId }: IDeleteProjectUseCaseRequest
  ): Promise<void> {
    const dbUserProjects = await this.projectRepo.getAllByOwnerId(userId)
    if(!dbUserProjects.find(p => p.id == projectId))
      throw new NoPermitionError()

    await this.projectRepo.softDelete(projectId)
  }
}

export default DeleteProjectUseCase
