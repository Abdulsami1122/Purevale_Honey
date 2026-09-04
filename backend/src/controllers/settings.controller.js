const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/apiResponse')
const service = require('../services/siteSettings.service')

// GET /api/settings  (public)
const getSettings = asyncHandler(async (_req, res) => {
  sendSuccess(res, 200, 'Site settings', { settings: await service.getSettings() })
})

// PUT /api/settings  (admin) — deep-merges the patch into the stored document
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await service.updateSettings(req.body)
  sendSuccess(res, 200, 'Site settings updated', { settings })
})

module.exports = { getSettings, updateSettings }
