import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("UpdateUserController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should update user", async () => {
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

    const updateResp = await request(sut.server)
      .patch('/api/user/plan')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ plan: 'PRO' })

    expect(updateResp.statusCode).toEqual(204)
    expect(updateResp.body).toEqual({})

    const { body } = await request(sut.server)
      .get('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(body.plan).toEqual('PRO')
  })
})