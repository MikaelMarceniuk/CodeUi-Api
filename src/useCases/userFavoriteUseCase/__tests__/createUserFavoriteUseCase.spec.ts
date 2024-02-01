import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryUserFavoriteRepo from '@repository/inMemory/inMemoryUserFavoriteRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import UserFavoriteLimitError from '@useCases/errors/UserFavoriteLimitError'
import UserNotFoundError from '@useCases/errors/UserNotFoundError'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import CreateUserFavoriteUseCase from '../createUserFavoriteUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryUserFavoriteRepo: InMemoryUserFavoriteRepo
let sut: CreateUserFavoriteUseCase

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
    inMemoryUserFavoriteRepo = new InMemoryUserFavoriteRepo()
  })

  beforeEach(async () => {
    await inMemoryPostgresql.rollback()
    dbUser = await inMemoryUserRepo.save(defaultUser)

    sut = new CreateUserFavoriteUseCase(inMemoryUserRepo, inMemoryUserFavoriteRepo)
  })

  it('Should create userFavorite', async () => {
    const { userFavorite } = await sut.execute({
      userId: dbUser.id,
      name: 'Servicos'
    })

    expect(userFavorite.id).toEqual(1)
    expect(userFavorite.user_id).toEqual(dbUser.id)
    expect(userFavorite.name).toEqual('Servicos')
  })

  it('Should throw UserNotFoundError', async () => {
    await expect(sut.execute({
      userId: '1',
      name: 'Servicos'
    })).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('Should throw "User can only have 3 favorites."', async () => {
    await inMemoryUserFavoriteRepo.save({
      user_id: dbUser.id,
      name: 'Servicos'
    })

    await inMemoryUserFavoriteRepo.save({
      user_id: dbUser.id,
      name: 'Analytics'
    })

    await inMemoryUserFavoriteRepo.save({
      user_id: dbUser.id,
      name: 'Relatorios'
    })

    await expect(sut.execute({
      userId: dbUser.id,
      name: 'Servicos'
    })).rejects.toBeInstanceOf(UserFavoriteLimitError)
  })
})
