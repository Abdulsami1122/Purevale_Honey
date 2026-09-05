const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

// POST /api/submissions/contact  (public)
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body
  const submission = await prisma.submission.create({
    data: { type: 'contact', name, email, phone, message },
  })
  sendSuccess(res, 201, 'Message received', { submission })
})

// POST /api/submissions/export  (public)
const createExport = asyncHandler(async (req, res) => {
  const { name, company, email, phone, destination, product, message } = req.body
  const submission = await prisma.submission.create({
    data: {
      type: 'export',
      name: name || company,
      email,
      phone,
      company,
      destination,
      product,
      message: message || null,
    },
  })
  sendSuccess(res, 201, 'Inquiry received', { submission })
})

// GET /api/submissions?type=contact|export  (admin)
const listSubmissions = asyncHandler(async (req, res) => {
  const where = {}
  if (req.validatedQuery?.type) where.type = req.validatedQuery.type
  const submissions = await prisma.submission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  sendSuccess(res, 200, 'Submissions', { submissions })
})

module.exports = { createContact, createExport, listSubmissions }
