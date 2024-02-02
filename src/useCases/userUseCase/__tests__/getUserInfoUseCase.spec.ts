import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import GetUserInfoUseCase from '../getUserInfoUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let sut: GetUserInfoUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User

describe('GetUserInfoUseCase', () => {
  beforeAll(async () => {
    inMemoryPostgresql = await new InMemoryPostgresql()
    await inMemoryPostgresql.init()

    inMemoryUserRepo = new InMemoryUserRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)

    sut = new GetUserInfoUseCase(inMemoryUserRepo)
  })

  it('Should return allUserInfo', async () => {
    const { user } = await sut.execute({
      userId: dbUser.id
    })

    expect(user.id).toEqual(dbUser.id)
    expect(user.favorites).toEqual(expect.any(Array))
    expect(user.projects).toEqual(expect.any(Array))
  })

  it('Should throw UserNotFoundError', async () => {
    await expect(sut.execute({ userId: '1'})).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
