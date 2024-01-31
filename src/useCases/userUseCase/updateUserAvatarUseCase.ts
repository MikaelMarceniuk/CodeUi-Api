import GoogleStorage from '@libs/googleStorage'
import IUserRepository from '@repository/IUserRepository'


interface IUpdateUserAvatarRequest {
  userId: string
  file: {
    name: string,
    path: string
  }
}

class UpdateUserAvatarUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute({ userId, file }: IUpdateUserAvatarRequest): Promise<void> {   
    const { unlink } = require('node:fs/promises')

    const fileUri = await new GoogleStorage().uploadBucketfile(file.name, file.path)
    await unlink(file.path)
    await  this.userRepo.update(userId, { avatar: fileUri })
  }
}

export default UpdateUserAvatarUseCase
