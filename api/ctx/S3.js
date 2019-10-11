const path = require('path')
const AWS = require('aws-sdk')
const config = require('../config')

const S3 = new AWS.S3({
  accessKeyId: config.S3_KEY,
  secretAccessKey: config.S3_SECRET,
  region: config.S3_REGION,
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
})

/**
 * returns all the objects that are present in the S3 bucket
 * @returns {[File!]!} The array of the files
 */
function fetchAllObjects() {
  // Bucket is required
  // Prefix should match the folder where the files uploaded
  const params = {
    Bucket: config.S3_BUCKET,
    Prefix: `${config.S3_UPLOADS_FOLDER}/`
  }
  return S3.listObjects(params)
    .promise()
    .then(data => data.Contents)
    .then(files =>
      files.map(file => {
        const mimeType = path.extname(file.Key)
        const fileName = path.basename(file.Key)
        return {
          id: file.ETag,
          path: file.Key,
          mimeType,
          fileName
        }
      })
    )
    .catch(error => {
      throw error
    })
}

/**
 * Upload a file to S3 bucket
 * @param {GraphQLUpload} upload GraphQL file upload.
 * @returns {File} File type.
 */
async function storeObject(upload) {
  const file = await upload
  const { createReadStream, filename, mimetype } = file
  const fileStream = createReadStream()
  const fileWithUploadPath = `${config.S3_UPLOADS_FOLDER}/${filename}`
  const uploadParams = {
    Bucket: config.S3_BUCKET,
    Key: fileWithUploadPath,
    Body: fileStream
  }
  const result = await S3.upload(uploadParams).promise()
  return {
    id: result.ETag,
    path: result.Key,
    fileName: filename,
    mimeType: mimetype
  }
}

const createS3Context = {
  fetchAllObjects,
  storeObject
}

module.exports = createS3Context
