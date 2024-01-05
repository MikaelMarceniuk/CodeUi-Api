import Contact, { IContactSchema } from '@models/contacts'
import IContactRepository from '@repository/IContactRepository'

class MongoDbContactRepo implements IContactRepository {
  async save(data: IContactSchema) {
    return await new Contact({ ...data }).save()
  }
}

export default MongoDbContactRepo
