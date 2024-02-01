import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("CreateUserFavoriteController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should create user favorite", async () => {
    await request(sut.server)
      .post('/api/user')
      .send({
        email: 'johndoe@proton.me',
        password: '123456'
      })

    const { body: { accessToken } } = await request(sut.server)
    .post('/api/user/session')
    .send({
      email: 'johndoe@proton.me',
      password: '123456'
    })

    const { statusCode, body } = await request(sut.server)
      .post('/api/user/favorite')
      .set({ 'Authorization': `Bearer ${accessToken}` })
      .send({ name: 'Servicos' })

    expect(statusCode).toEqual(201)
    expect(body).toEqual({})
  })
})