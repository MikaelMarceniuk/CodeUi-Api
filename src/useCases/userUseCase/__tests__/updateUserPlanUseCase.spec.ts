import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import UpdateUserPlanUseCase from '../updateUserPlanUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let sut: UpdateUserPlanUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  password_hash: '123456'
}

let dbUser: User

describe('UpdateUserUseCase', () => {
  beforeAll(async () => {
    inMemoryPostgresql = await new InMemoryPostgresql()
    await inMemoryPostgresql.init()

    inMemoryUserRepo = new InMemoryUserRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)

    sut = new UpdateUserPlanUseCase(inMemoryUserRepo)
  })

  it('Should update user plan to PRO', async () => {
    await sut.execute({ userId: dbUser.id, plan: 'PRO' })

    const updatedUser = await inMemoryUserRepo.findById(dbUser.id)
    expect(updatedUser?.plan).toEqual('PRO')
  })

  it('Should throw UserNotFoundError', async () => {
    await expect(sut.execute(
      '1',
      {
        username: '',
        avatar: '',
        contact: '',
        preferred_currency: ''
      }
    )).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
