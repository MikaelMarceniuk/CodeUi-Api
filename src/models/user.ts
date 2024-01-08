import mongoose from 'mongoose'

export interface IUserSchema {
  email: string
  password: string
  createdAt?: string
}

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model<IUserSchema>('User', userSchema)

export default User
