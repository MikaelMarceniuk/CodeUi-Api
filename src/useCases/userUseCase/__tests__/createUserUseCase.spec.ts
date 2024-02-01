import InMemoryPostgresql from '@libs/inMemoryPostgres'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import UserAlreadyExistsError from '@useCases/errors/UserAlreadyExists'
import doesPasswordHashMatchPassword from '@utils/doesPasswordHashMatchPassword'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import CreateUserUseCase from '../createUserUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let sut: CreateUserUseCase

const defaultUser = {
  username: 'John Doe',
  email: 'johndoe@proton.me',
  passwordHash: '$2b$06$LR5p0w/GA9.2yAt8lUPzTONqC6lqywGIA7RGnrg3THEjRJvAF3oUm',
  password: '123456'
}

describe('CreateUserUseCase', () => {
  beforeAll(async () => {
    inMemoryPostgresql = await new InMemoryPostgresql()
    await inMemoryPostgresql.init()

    inMemoryUserRepo = new InMemoryUserRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()

    sut = new CreateUserUseCase(inMemoryUserRepo)
  })

  it('Should create user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@proton.me',
      password: '123456'
    })

    const isPasswordHashed = await doesPasswordHashMatchPassword('123456', user.password_hash)

    expect(user.id).toEqual(expect.any(String))
    expect(user.username).toEqual('johndoe')
    expect(isPasswordHashed).toEqual(true)
  })

  it('Should throw UserAlreadyExistsError', async () => {
    await inMemoryUserRepo.save({
      username: 'johndoe',
      email: 'johndoe@proton.me',
      password_hash: '123456',
    })

    await expect(sut.execute({
      email: 'johndoe@proton.me',
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
