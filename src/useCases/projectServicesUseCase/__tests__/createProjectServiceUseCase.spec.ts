import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { Project, User } from '@prisma/client'
import InMemoryProjectRepo from '@repository/inMemory/inMemoryProjectRepo'
import InMemoryProjectServiceRepo from '@repository/inMemory/inMemoryProjectServiceRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import ResourceAlreadyExistsError from '@useCases/errors/ResourceAlreadyExistsError'
import ResourceNotFoundError from '@useCases/errors/ResourceNotFoundError'
import moment from 'moment'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import CreateProjectServiceUseCaseUseCase from '../createProjectServiceUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryProjectRepo: InMemoryProjectRepo
let inMemoryProjectServiceRepo: InMemoryProjectServiceRepo
let sut: CreateProjectServiceUseCaseUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User
let dbProject: Project

describe('CreateProjectServiceUseCase', () => {
  beforeAll(async () => {
    inMemoryPostgresql = await new InMemoryPostgresql()
    await inMemoryPostgresql.init()

    inMemoryUserRepo = new InMemoryUserRepo()
    inMemoryProjectRepo = new InMemoryProjectRepo()
    inMemoryProjectServiceRepo = new InMemoryProjectServiceRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)
    dbProject = await inMemoryProjectRepo.save({
      owner_id: dbUser.id,
      name: 'Portfolio',
    })

    sut = new CreateProjectServiceUseCaseUseCase(inMemoryProjectRepo, inMemoryProjectServiceRepo)
  })

  it('Should create project service', async () => {
    const { projectService } = await sut.execute({
      projectId: dbProject.id,
      serviceInfo: {
        name: 'Hospedagem',
        valor: '10.99',
        start_date: moment('2024-01-01').toDate().toJSON(),
        end_date: moment('2025-01-01').toDate().toJSON()
      }
    })

    expect(projectService.id).toEqual(expect.any(String))
  })

  it('Should throw ResourceNotFoundError', async () => {
    await expect(sut.execute({
      projectId: '1',
      serviceInfo: {
        name: 'Hospedagem',
        valor: '10.99',
        start_date: moment('2024-01-01').toDate().toJSON(),
        end_date: moment('2025-01-01').toDate().toJSON()
      }
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should throw ResourceAlreadyExistsError', async () => {
    await inMemoryProjectServiceRepo.save({
      project_id: dbProject.id,
      name: 'Hospedagem',
      valor: '10.99',
      start_date: moment('2024-01-01').toDate().toJSON(),
      end_date: moment('2025-01-01').toDate().toJSON()
    })

    await expect(sut.execute({
      projectId: dbProject.id,
      serviceInfo: {
        name: 'Hospedagem',
        valor: '10.99',
        start_date: moment('2024-01-01').toDate().toJSON(),
        end_date: moment('2025-01-01').toDate().toJSON()
      }
    })).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
