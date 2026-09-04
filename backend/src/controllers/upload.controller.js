const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { uploadDataUri } = require('../services/upload.service')

// POST /api/uploads  (admin) — body: { file: "data:image/...;base64,..." | "data:video/..." }
const upload = asyncHandler(async (req, res) => {
  const file = typeof req.body?.file === 'string' ? req.body.file : ''
  if (!file) throw ApiError.badRequest('file (data URI) is required')
  const result = await uploadDataUri(file)
  sendSuccess(res, 201, 'File uploaded', result)
})

module.exports = { upload }
