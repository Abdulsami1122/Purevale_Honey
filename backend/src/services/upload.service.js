// Cloudinary wrapper. Uploads are optional: if the CLOUDINARY_* env vars are
// not set, callers get a clear 503 instead of a crash.
const env = require('../config/env')
const ApiError = require('../utils/ApiError')
const logger = require('../utils/logger')

let cloudinary = null
if (env.UPLOADS_ENABLED) {
  cloudinary = require('cloudinary').v2
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  })
}

/**
 * @param {string} dataUri  data:image/... or data:video/... base64 string
 */
async function uploadDataUri(dataUri) {
  if (!cloudinary) {
    throw new ApiError(503, 'File uploads are not configured on the server')
  }
  const isImage = dataUri.startsWith('data:image/')
  const isVideo = dataUri.startsWith('data:video/')
  if (!isImage && !isVideo) {
    throw ApiError.badRequest('A valid image or video file is required')
  }

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'purevale-honey',
      resource_type: isVideo ? 'video' : 'image',
    })
    return { url: result.secure_url, publicId: result.public_id }
  } catch (err) {
    logger.error('[cloudinary] upload failed', err)
    throw new ApiError(502, 'Could not upload the file')
  }
}

module.exports = { uploadDataUri }
