import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import InvalidCredentialsError from '@useCases/errors/InvalidCredentials'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import AuthUserUseCase from '../authUserUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let sut: AuthUserUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  // PasswordHash for 123456
  password_hash: '$2b$06$LR5p0w/GA9.2yAt8lUPzTONqC6lqywGIA7RGnrg3THEjRJvAF3oUm'
}

let dbUser: User

describe('AuthUserUseCase', () => {
  beforeAll(async () => {
    inMemoryPostgresql = await new InMemoryPostgresql()
    await inMemoryPostgresql.init()

    inMemoryUserRepo = new InMemoryUserRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)

    sut = new AuthUserUseCase(inMemoryUserRepo)
  })

  it('Should return user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@proton.me',
      password: '123456'
    })

    expect(user.id).toEqual(dbUser.id)
  })

  it('Should throw InvalidCredentialsError because user does not exists', async () => {
    await expect(sut.execute({
      email: 'alan.turing@proton.me',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Should throw InvalidCredentialsError because password is wrong', async () => {
    await expect(sut.execute({
      email: 'johndoe@proton.me',
      password: '123'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
