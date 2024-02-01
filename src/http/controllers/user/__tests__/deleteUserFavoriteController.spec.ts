import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("DeleteUserFavoriteController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should delete user favorite", async () => {
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

    await request(sut.server)
      .post('/api/user/favorite')
      .set({ 'Authorization': `Bearer ${accessToken}` })
      .send({ name: 'Servicos' })

    const { statusCode, body } = await request(sut.server)
      .delete(`/api/user/favorite/1`)
      .set({ 'Authorization': `Bearer ${accessToken}` })

    expect(statusCode).toEqual(204)
    expect(body).toEqual({})
  })
})