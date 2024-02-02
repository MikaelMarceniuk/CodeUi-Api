import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { Project, User } from '@prisma/client'
import InMemoryProjectRepo from '@repository/inMemory/inMemoryProjectRepo'
import InMemoryProjectServiceRepo from '@repository/inMemory/inMemoryProjectServiceRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import NoPermitionError from '@useCases/errors/NoPermitionError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import UpdateProjectUseCase from '../updateProjectUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryProjectRepo: InMemoryProjectRepo
let inMemoryProjectServiceRepo: InMemoryProjectServiceRepo
let sut: UpdateProjectUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User
let dbProject: Project

describe('UpdateProjectUseCase', () => {
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
    dbProject = await inMemoryProjectRepo.saveWithGoogleAnalyticsService({
      owner_id: dbUser.id,
      name: 'Portfolio'
    })

    sut = new UpdateProjectUseCase(inMemoryProjectRepo)
  })

  it('Should update project', async () => {
    const { project } = await sut.execute({
      userId: dbUser.id,
      projectId: dbProject.id,
      data: { name: 'Blog' }
    })

    expect(project.name).toEqual('Blog')
  })

  it('Should throw NoPermitionError', async () => {
    await expect(sut.execute({
      userId: '1',
      projectId: dbProject.id,
      data: { name: 'Blog' }
    })).rejects.toBeInstanceOf(NoPermitionError)
  })
})
