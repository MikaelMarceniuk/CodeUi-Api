import { PrismaClient } from '@prisma/client'

class Postgresql {
  private static instance: PrismaClient

  async init() {
    try {
      Postgresql.instance = new PrismaClient()
      Postgresql.instance.$connect()
      console.log('Connected to Postgresql!')
    } catch (e) {
      console.log('Error connecting to Postgresql: ', e)
      await Postgresql.instance.$disconnect()
      throw e
    }
  }

  static getInstance() {
    if (!Postgresql.instance) {
      console.error('Postgresql instance not instantiated.')
    }

    return Postgresql.instance
  }
}

export default Postgresql
