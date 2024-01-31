import env from "@config/env";
import { Storage } from "@google-cloud/storage";

class GoogleStorage {
  private storage: Storage

  constructor() {   
    this.storage = new Storage({
      projectId: env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: env.GOOGLE_STORAGE_EMAIL,
        private_key: env.GOOGLE_STORAGE_KEY.replace(/\\n/g, "\n")
      }
    })
  }

  async uploadBucketfile(filename: string, filepath: string) {
    const fs = require('node:fs')
    const stream = require('node:stream')

    const bFileDir = env.NODE_ENV.toLocaleLowerCase()

    const bucket = this.storage.bucket('codeui-api');
    const bFile = bucket.file(`${bFileDir}/${filename}`);

    const localFile = await fs.readFileSync(filepath)

    // Create a pass through stream from a string
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(localFile);
    passthroughStream.end();

    passthroughStream.pipe(bFile.createWriteStream())
      .on('finish', () => {
        console.log('Upload is finished')
      });

    return `https://storage.cloud.google.com/codeui-api/${bFileDir}/${filename}`
  }
}

export default GoogleStorage