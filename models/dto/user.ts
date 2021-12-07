import { ObjectId } from 'mongoose'

type UserModel = {
  _id: ObjectId
  email: string
  avatar: string
  role: string
}

export default class UserDto {
  readonly email: string
  readonly id: ObjectId
  readonly avatar: string
  readonly role: string

  constructor(model: UserModel) {
    this.email = model.email
    this.id = model._id
    this.avatar = model.avatar
    this.role = model.role
  }
}
