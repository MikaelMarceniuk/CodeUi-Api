import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryProjectRepo from '@repository/inMemory/inMemoryProjectRepo'
import InMemoryProjectServiceRepo from '@repository/inMemory/inMemoryProjectServiceRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import GetProjectsByUserUseCase from '../getProjectsByUserUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryProjectRepo: InMemoryProjectRepo
let inMemoryProjectServiceRepo: InMemoryProjectServiceRepo
let sut: GetProjectsByUserUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User

describe('GetProjectsByUserUseCase', () => {
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

    await inMemoryProjectRepo.saveWithGoogleAnalyticsService({
      owner_id: dbUser.id,
      name: 'Portfolio'
    })

    await inMemoryProjectRepo.saveWithGoogleAnalyticsService({
      owner_id: dbUser.id,
      name: 'Blog'
    })

    sut = new GetProjectsByUserUseCase(inMemoryProjectRepo)
  })

  it('Should return user projects', async () => {
    const { projects } = await sut.execute({ userId: dbUser.id })

    expect(projects).toBeInstanceOf(Array)
    expect(projects.length).toEqual(2)
  })

  it('Should return an empty array', async () => {
    const { projects } = await sut.execute({ userId: '1' })

    expect(projects).toEqual([])
  })
})
