import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryProjectRepo from '@repository/inMemory/inMemoryProjectRepo'
import InMemoryProjectServiceRepo from '@repository/inMemory/inMemoryProjectServiceRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import ResourceAlreadyExistsError from '@useCases/errors/ResourceAlreadyExistsError'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import CreateProjectUseCase from '../createProjectUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryProjectRepo: InMemoryProjectRepo
let inMemoryProjectServiceRepo: InMemoryProjectServiceRepo
let sut: CreateProjectUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User

describe('CreateUserFavoriteUseCase', () => {
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

    sut = new CreateProjectUseCase(inMemoryUserRepo, inMemoryProjectRepo)
  })

  it('Should create project', async () => {
    const { project } = await sut.execute({
      userId: dbUser.id,
      name: 'Portfolio'
    })

    expect(project.id).toEqual(expect.any(String))
    expect(project.owner_id).toEqual(dbUser.id)
    expect(project.name).toEqual('Portfolio')
  })

  it('Should create project with Google Analytics Service', async () => {
    const { project } = await sut.execute({
      userId: dbUser.id,
      name: 'Portfolio'
    })

    const services = await inMemoryProjectServiceRepo.getAllByProjectId(project.id)

    expect(services.length).toEqual(1)
    expect(services[0].name).toEqual('Google Analytics')
  })

  it('Should throw UserNotFoundError', async () => {
    await expect(sut.execute({
      userId: '1',
      name: 'Portfolio'
    })).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('Should throw ResourceAlreadyExistsError', async () => {
    inMemoryProjectRepo.save({
      owner_id: dbUser.id,
      name: 'Portfolio'
    })

    await expect(sut.execute({
      userId: dbUser.id,
      name: 'Portfolio'
    })).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
