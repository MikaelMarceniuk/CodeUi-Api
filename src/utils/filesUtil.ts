import { resolve } from "node:path"

export const getUploadsFolderDir = () => resolve(__dirname, '..', 'uploads')

export const generateNewAvatarFilename = (
  data: { 
    userid: string,
    filename: string
  }
) => {
  const fileExt = data.filename.split('.').pop()
  const currentTime = new Date().toJSON()

  return `${data.userid}-${currentTime}-avatar.${fileExt}`
}