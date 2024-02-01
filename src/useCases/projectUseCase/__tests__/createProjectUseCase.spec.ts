import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryProjectRepo from '@repository/inMemory/inMemoryProjectRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import ResourceAlreadyExistsError from '@useCases/errors/ResourceAlreadyExistsError'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import CreateProjectUseCaseUseCase from '../createProjectUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryProjectRepo: InMemoryProjectRepo
let sut: CreateProjectUseCaseUseCase

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
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)

    sut = new CreateProjectUseCaseUseCase(inMemoryUserRepo, inMemoryProjectRepo)
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
