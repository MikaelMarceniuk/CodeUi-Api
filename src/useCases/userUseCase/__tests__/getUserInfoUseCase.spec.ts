import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import InMemoryPostgresql from '@libs/inMemoryPostgres'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import { User } from '@prisma/client'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
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

  it('Should update user', async () => {
    const { user } = await sut.execute({
      userId: dbUser.id
    })

    expect(user.id).toEqual(dbUser.id)
  })

  it('Should throw UserNotFoundError', async () => {
    await expect(sut.execute({ userId: '1'})).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
