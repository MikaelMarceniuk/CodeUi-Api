import { IContactSchema } from '@models/contacts'
import { HydratedDocument } from 'mongoose'

interface IContactRepository {
  save(data: IContactSchema): Promise<HydratedDocument<IContactSchema>>
}

export default IContactRepository
