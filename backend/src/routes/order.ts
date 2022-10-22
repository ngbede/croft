import { Router } from 'express'
import authenticator from '../middleware/auth/authenticator'
import {
  getOrder,
  createOrder,
  updateOrder,
} from '../controllers/order-controller'

const orderRouter = Router()

orderRouter.get('/order', authenticator(), getOrder)
orderRouter.get('/order/:id', authenticator(), getOrder) // get single order doc
orderRouter.post('/order/create', authenticator(), createOrder)
orderRouter.patch('/order/:id', authenticator(), updateOrder)
// orderRouter.delete('order/:id', authenticator) // we shouldn't outrightl delete order entities

export default orderRouter
