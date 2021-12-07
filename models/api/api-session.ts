import UserDto from 'models/dto/user'

export interface ApiSession {
  user: UserDto
  accessToken: string
}
