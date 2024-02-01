import { FastifyInstance } from "fastify"
import App from "src/app"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let sut: FastifyInstance

describe("GetAllCurrencyController", () => {
  beforeAll(async () => {
    const app = new App()
    await app.init()
    await app.app.ready()
    sut = app.app
  })

  afterAll(async () => {
    await sut.close()
  })

  it("Should return all currencies", async () => {
    const apiResp = await request(sut.server)
      .get('/api/currency')
      .send()

    expect(apiResp.statusCode).toEqual(200)
    expect(apiResp.body).toEqual({
      currencies: [
        'BRL',
        'USD',
        'EUR'
      ]
    })
  })
})