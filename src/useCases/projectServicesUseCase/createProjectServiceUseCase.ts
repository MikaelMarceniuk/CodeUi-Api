import { ProjectService } from "@prisma/client"
import IProjectRepository from "@repository/IProjectRepository"
import IProjectServiceRepository from "@repository/IProjectServiceRepository"
import ResourceAlreadyExistsError from "@useCases/errors/ResourceAlreadyExistsError"
import ResourceNotFoundError from "@useCases/errors/ResourceNotFoundError"

interface ICreateProjectServiceUseCaseRequest {
  projectId: string
  serviceInfo: {
    name: string
    valor: string
    start_date: string
    end_date: string
  }
}

interface ICreateProjectServiceUseCaseResponse {
  projectService: ProjectService
}

class CreateProjectServiceUseCaseUseCase {
  constructor(
    private projectRepo: IProjectRepository,
    private projectServiceRepo: IProjectServiceRepository,
  ) {}

  async execute(
    { projectId, serviceInfo }: ICreateProjectServiceUseCaseRequest
  ): Promise<ICreateProjectServiceUseCaseResponse> {
    const dbProject = await this.projectRepo.findById(projectId)
    if(!dbProject)
      throw new ResourceNotFoundError()

    const dbProjectServices = await this.projectServiceRepo.getAllByProjectId(projectId)
    if(dbProjectServices.find(ps => ps.name == serviceInfo.name))
      throw new ResourceAlreadyExistsError()

    const dbProjectService = await this.projectServiceRepo.save({
      project_id: projectId,
      name: serviceInfo.name,
      valor: serviceInfo.valor,
      start_date: serviceInfo.start_date,
      end_date: serviceInfo.end_date
    })

    return {
      projectService: dbProjectService
    }
  }
}

export default CreateProjectServiceUseCaseUseCase
