import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
const fs = require('node:fs')
const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)

const updateUserAvatarController = async (req: FastifyRequest, rep: FastifyReply) => {
  const { file, filename } = await req.file()

  const fileExt = filename.split('.').pop()
  const newFilename = `${randomUUID()}-${new Date().toJSON()}-avatar.${fileExt}`
  const fileDirPath = resolve(__dirname, '..', '..', '..', '..', 'uploads', newFilename)

  await pump(file, fs.createWriteStream(fileDirPath))

  rep.statusCode = 200
  rep.send()
}

export default updateUserAvatarController
