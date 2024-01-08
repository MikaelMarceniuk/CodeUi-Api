import { IUserSchema } from '@models/user'
import { HydratedDocument } from 'mongoose'

interface IUserRepository {
  findByEmail(email: string): Promise<HydratedDocument<IUserSchema>[]>
  save(data: IUserSchema): Promise<HydratedDocument<IUserSchema>>
}

export default IUserRepository
