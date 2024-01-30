import InMemoryPostgresql from '@libs/inMemoryPostgres'
import { User } from '@prisma/client'
import InMemoryUserFavoriteRepo from '@repository/inMemory/inMemoryUserFavoriteRepo'
import InMemoryUserRepo from '@repository/inMemory/inMemoryUserRepo'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import DeleteUserFavoriteUseCase from '../deleteUserFavoriteUseCase'

let inMemoryPostgresql: InMemoryPostgresql
let inMemoryUserRepo: InMemoryUserRepo
let inMemoryUserFavoriteRepo: InMemoryUserFavoriteRepo
let sut: DeleteUserFavoriteUseCase

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

    sut = new DeleteUserFavoriteUseCase(inMemoryUserFavoriteRepo)
  })

  it('Should delete userFavorite', async () => {
    const userFavorite = await inMemoryUserFavoriteRepo.save({
      user_id: dbUser.id,
      name: 'Servicos'
    })

    await sut.execute({ userId: dbUser.id, userFavoriteId: userFavorite.id })

    expect(await inMemoryUserFavoriteRepo.findById(userFavorite.id)).toEqual(null)
  })

  it('Should throw Error "Resource not found."', async () => {
    await expect(
      sut.execute({ userId: dbUser.id, userFavoriteId: 1 })
    ).rejects.toBeInstanceOf(Error)
  })

  it('Should throw Error "Not enough permission."', async () => {
    const userFavorite = await inMemoryUserFavoriteRepo.save({
      user_id: dbUser.id,
      name: 'Servicos'
    })

    await expect(
      sut.execute({ userId: '1', userFavoriteId: userFavorite.id })
    ).rejects.toBeInstanceOf(Error)
  })
})
