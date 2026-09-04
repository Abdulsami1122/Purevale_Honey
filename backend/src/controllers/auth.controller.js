const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const env = require('../config/env')
const authService = require('../services/auth.service')
const tokenService = require('../services/token.service')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/email.service')

const cookieBase = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  domain: env.COOKIE_DOMAIN || undefined,
}

// Refresh cookie is scoped to the auth routes so it is never sent on normal API calls.
const REFRESH_PATH = '/api/auth'

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('accessToken', accessToken, {
    ...cookieBase,
    path: '/',
    maxAge: env.ACCESS_COOKIE_MAX_AGE_MS,
  })
  res.cookie('refreshToken', refreshToken, {
    ...cookieBase,
    path: REFRESH_PATH,
    maxAge: env.REFRESH_COOKIE_MAX_AGE_MS,
  })
}

function clearAuthCookies(res) {
  res.clearCookie('accessToken', { ...cookieBase, path: '/' })
  res.clearCookie('refreshToken', { ...cookieBase, path: REFRESH_PATH })
}

const register = asyncHandler(async (req, res) => {
  // Registration does NOT sign the user in — they log in afterwards.
  const user = await authService.registerUser(req.body)
  sendWelcomeEmail(user).catch(() => {})
  sendSuccess(res, 201, 'Account created — please sign in', { user })
})

const login = asyncHandler(async (req, res) => {
  const user = await authService.verifyCredentials(req.body)
  const tokens = await tokenService.issueTokenPair(user)
  setAuthCookies(res, tokens)
  sendSuccess(res, 200, 'Logged in', { user })
})

const refresh = asyncHandler(async (req, res) => {
  const result = await tokenService.rotateRefreshToken(req.cookies?.refreshToken)
  if (!result) {
    clearAuthCookies(res)
    throw ApiError.unauthorized('Session expired — please log in again')
  }
  setAuthCookies(res, result)
  const { id, name, email, role } = result.user
  sendSuccess(res, 200, 'Session refreshed', { user: { id, name, email, role } })
})

const logout = asyncHandler(async (req, res) => {
  await tokenService.revokeRefreshToken(req.cookies?.refreshToken)
  clearAuthCookies(res)
  sendSuccess(res, 200, 'Logged out')
})

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Current user', { user: req.user })
})

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body)
  // Force re-login everywhere: drop refresh tokens + clear cookies.
  await tokenService.revokeAllForUser(req.user.id)
  clearAuthCookies(res)
  sendSuccess(res, 200, 'Password changed — please sign in again')
})

const GENERIC_RESET_MSG = 'If an account exists for that email, a reset link has been sent'

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.createPasswordReset(req.body)
  if (result) {
    const resetUrl = `${env.APP_URL}/reset-password?token=${result.rawToken}`
    sendPasswordResetEmail(result.user, resetUrl).catch(() => {})
    // Dev convenience: return the link so it's usable without a real mail server.
    if (!env.isProd) {
      return sendSuccess(res, 200, GENERIC_RESET_MSG, { resetUrl })
    }
  }
  sendSuccess(res, 200, GENERIC_RESET_MSG)
})

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPasswordWithToken(req.body)
  clearAuthCookies(res)
  sendSuccess(res, 200, 'Password updated — please sign in with your new password')
})

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  changePassword,
  forgotPassword,
  resetPassword,
}
