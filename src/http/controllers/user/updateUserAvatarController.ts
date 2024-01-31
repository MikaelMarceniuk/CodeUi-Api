import env from '@config/env'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import { generateNewAvatarFilename, getUploadsFolderDir } from '@utils/filesUtil'
import { FastifyReply, FastifyRequest } from 'fastify'
import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
const fs = require('node:fs')
const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)

const updateUserAvatarController = async (req: FastifyRequest, rep: FastifyReply) => {
  const { file, filename } = await req.file()

  const newFilename = generateNewAvatarFilename({
    filename,
    userid: req.user.id
  })
  const filePath = resolve(getUploadsFolderDir(), newFilename)

  await pump(file, fs.createWriteStream(filePath))

  const avatarUri = `${req.protocol}://${req.hostname}/uploads/${newFilename}`
  await new PrismaUserRepo().update(req.user.id, { avatar: avatarUri })

  if(env.NODE_ENV == 'PRD')
    await unlink(filePath)

  rep.statusCode = 200
  rep.send()
}

export default updateUserAvatarController
