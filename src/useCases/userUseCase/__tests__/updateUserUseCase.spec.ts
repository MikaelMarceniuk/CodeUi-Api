import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import InMemoryPostgresql from '@libs/inMemoryPostgres'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import { User } from '@prisma/client'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import UpdateUserUseCase from '../updateUserUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let sut: UpdateUserUseCase

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

    sut = new UpdateUserUseCase(inMemoryUserRepo)
  })

  it('Should update user', async () => {
    const newUsername = 'Alan Turing'
    const newAvatar = 'avatar.com.br'
    const newContact = '2199999999'
    const newPreferredCurrency = 'BR'

    const { user } = await sut.execute(
      dbUser.id,
      {
        username: newUsername,
        avatar: newAvatar,
        contact: newContact,
        preferred_currency: newPreferredCurrency
      }
    )

    expect(user.username).toEqual(newUsername)
    expect(user.avatar).toEqual(newAvatar)
    expect(user.contact).toEqual(newContact)
    expect(user.preferred_currency).toEqual(newPreferredCurrency)
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
