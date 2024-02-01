import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("RefreshTokenController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should get new JWT Token", async () => {
    await request(sut.server)
      .post('/api/user')
      .send({
        email: 'johndoe@proton.me',
        password: '123456'
      })

    const { headers: sessionHeaders } = await request(sut.server)
      .post('/api/user/session')
      .send({
        email: 'johndoe@proton.me',
        password: '123456'
      })

    const { body, headers } = await request(sut.server)
      .post('/api/user/session/refresh')
      .set('Cookie', sessionHeaders['set-cookie'])
      .send({
        email: 'johndoe@proton.me',
        password: '123456'
      })

    const refreshTokenCookie = headers['set-cookie'][0].split('; ').find(c => c.includes('refreshToken'))

    expect(body).toEqual({ token: expect.any(String) })
    expect(Boolean(refreshTokenCookie)).toEqual(true)
  })
})