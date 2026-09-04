// Single place that decides the success-response envelope shape.
function sendSuccess(res, statusCode, message, data = null, extra = {}) {
  return res.status(statusCode).json({ success: true, message, data, ...extra })
}

module.exports = { sendSuccess }
