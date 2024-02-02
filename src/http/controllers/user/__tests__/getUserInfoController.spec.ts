import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("GetUserInfoController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should getUserInfo", async () => {
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
      .get('/api/user/')
      .set({ 'Authorization': `Bearer ${accessToken}` })
      .send()

    expect(statusCode).toEqual(200)
    expect(body).toEqual({
      id: expect.any(String),
      username: 'johndoe',
      email: 'johndoe@proton.me',
      password_hash: expect.any(String),
      contact: null,
      avatar: null,
      preferred_currency: 'BRL',
      plan: 'FREE',
      created_at: expect.any(String),
      favorites: expect.any(Array),
      projects: expect.any(Array),
    })
  })
})