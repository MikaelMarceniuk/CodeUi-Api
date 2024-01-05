import mongoose from 'mongoose'

export interface IContactSchema {
  clientName: string
  clientEmail: string
  clientMobileNumber: string
  clientHearAboutUs: string
  clientAboutProject: string
  clientWayOfContact: string
  createdAt: string
}

const contactSchema = new mongoose.Schema({
  clientName: String,
  clientEmail: String,
  clientMobileNumber: String,
  clientHearAboutUs: String,
  clientAboutProject: String,
  clientWayOfContact: String,
  createdAt: String,
})

const Contact = mongoose.model<IContactSchema>('Contact', contactSchema)

export default Contact
