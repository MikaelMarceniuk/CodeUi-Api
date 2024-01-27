import User, { IUserSchema } from '@models/user'
import IUserRepository from '@repository/IUserRepository'

class MongoDbUserRepo implements IUserRepository {
  async findByEmail(email: string) {
    return await User.find({ email }).exec()
  }

  async save(data: IUserSchema) {
    return await new User({ ...data }).save()
  }
}

export default MongoDbUserRepo
