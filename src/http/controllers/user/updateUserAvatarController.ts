import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import UpdateUserAvatarUseCase from '@useCases/userUseCase/updateUserAvatarUseCase'
import { generateNewAvatarFilename, getUploadsFolderDir } from '@utils/filesUtil'
import { FastifyReply, FastifyRequest } from 'fastify'
import path from 'path'
const fs = require('node:fs')
const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)

const updateUserAvatarController = async (req: FastifyRequest, rep: FastifyReply) => {
  let avatarFile = await req.file({
    limits: {
      files: 1
    }
  })
  if(!avatarFile) {
    rep.statusCode = 401
    rep.send({ message: 'Avatar file missing.'})
  }

  const newFilename = generateNewAvatarFilename({
    userid: req.user.id,
    filename: avatarFile?.filename as string
  })
  const filePath = path.resolve(getUploadsFolderDir(), newFilename)

  await pump(avatarFile?.file, fs.createWriteStream(filePath))

  await new UpdateUserAvatarUseCase(new PrismaUserRepo())
    .execute({
      userId: req.user.id,
      file: {
        name: newFilename,
        path: filePath
      }
    })

  rep.statusCode = 200
  rep.send()
}

export default updateUserAvatarController
