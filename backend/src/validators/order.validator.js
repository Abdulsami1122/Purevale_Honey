const { z } = require('zod')
const { uuid, paginationQuery } = require('./common.validator')

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const createOrderSchema = z.object({
  body: z.object({
    shipping: z.object({
      name: z.string().trim().min(2).max(120),
      phone: z.string().trim().min(6).max(30),
      address: z.string().trim().min(5).max(400),
      city: z.string().trim().min(2).max(120),
      country: z.string().trim().min(2).max(120),
    }),
    couponCode: z.string().trim().max(40).optional(),
    shippingCost: z.coerce.number().nonnegative().default(0),
  }),
})

const listOrdersSchema = z.object({
  query: paginationQuery.extend({
    status: z.enum(ORDER_STATUSES).optional(),
  }),
})

const updateOrderStatusSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ status: z.enum(ORDER_STATUSES) }),
})

module.exports = {
  ORDER_STATUSES,
  createOrderSchema,
  listOrdersSchema,
  updateOrderStatusSchema,
}
