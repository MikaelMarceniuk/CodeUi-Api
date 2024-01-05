import env from '@config/env'
import mongoose from 'mongoose'

class MongoDb {
  private static instance: typeof mongoose

  async init() {
    try {
      MongoDb.instance = await mongoose.connect(env.DATABASE_URL)
    } catch (e) {
      console.log('Error connecting to MongoDb: ', e)
      throw e
    }
  }

  getInstance() {
    if (!MongoDb.instance) {
      console.error('Discord instance not instantiated')
    }

    return MongoDb.instance
  }
}

export default MongoDb
