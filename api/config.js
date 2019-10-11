const dotenv = require('dotenv')

dotenv.config()

const config = {
  APP_PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  S3_SECRET: process.env.S3_SECRET,
  S3_KEY: process.env.S3_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_UPLOADS_FOLDER: process.env.S3_UPLOADS_FOLDER,
  S3_REGION: process.env.S3_REGION
}

module.exports = config
