import PrismaUserRepo from "@repository/prisma/PrismaUserRepo"
import hashUserPassword from "@utils/hashUserPassword"
import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("AuthUserController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should return jwt token", async () => {
    const dbUser = await new PrismaUserRepo().save({
      username: 'johndoe',
      email: 'johndoe@proton.me',
      password_hash: await hashUserPassword('123456')
    })

    const apiResp = await request(sut.server)
      .post('/api/user/session')
      .send({
        email: 'johndoe@proton.me',
        password: '123456'
      })

    const refreshTokenCookie = apiResp.headers['set-cookie'][0].split('; ').find(c => c.includes('refreshToken'))

    expect(apiResp.statusCode).toEqual(200)
    expect(Boolean(refreshTokenCookie)).toEqual(true)
    expect(apiResp.body).toEqual({
      accessToken: expect.any(String),
      user: {
        id: dbUser.id,
        email: dbUser.email
      }
    })
  })
})