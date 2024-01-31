import env from '@config/env'
import { Storage } from '@google-cloud/storage'
import PrismaUserRepo from '@repository/prisma/PrismaUserRepo'
import { generateNewAvatarFilename, getUploadsFolderDir } from '@utils/filesUtil'
import { FastifyReply, FastifyRequest } from 'fastify'
import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import stream from 'stream'
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
  let avatarUri

  await pump(file, fs.createWriteStream(filePath))

  if(env.NODE_ENV == 'DEV')
    avatarUri = `${req.protocol}://${req.hostname}/uploads/${newFilename}`

  if(env.NODE_ENV == 'PRD') {
    const storage = new Storage({
      keyFile: resolve(__dirname, '..', '..', '..', '..', 'keys', 'codeui--storage.json')
    })

    // Get a reference to the bucket
    const bucket = storage.bucket('codeui-api');

    // Create a reference to a file object
    const bFile = bucket.file(newFilename);

    // Create a pass through stream from a string
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(await fs.readFileSync(filePath));
    passthroughStream.end();

    const uploadFileToBucket = () => {
      passthroughStream.pipe(bFile.createWriteStream())
        .on('finish', () => {
          console.log('Upload is finished')
        });
    }
    uploadFileToBucket()

    avatarUri = `https://storage.cloud.google.com/codeui-api/${newFilename}`
    await unlink(filePath)
  }

  await new PrismaUserRepo().update(req.user.id, { avatar: avatarUri })

  rep.statusCode = 200
  rep.send()
}

export default updateUserAvatarController
