import { Router } from 'express'
import authenticator from '../middleware/auth/authenticator'
import {
  createStock,
  deleteStock,
  getStock,
  updateStock,
} from '../controllers/stock-controller'

const stockRouter = Router()

stockRouter.get('/stock/:id', authenticator, getStock) // get stock by its id
stockRouter.post('/stock/create', authenticator, createStock)
stockRouter.patch('/stock/:id', authenticator, updateStock)
stockRouter.delete('/stock/:id', authenticator, deleteStock)

export default stockRouter
