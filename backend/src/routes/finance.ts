// TODO: add fincance routes
/**
 * Proposed routes
 * /finance/pay-order
 * /finance/transaction?farm_id => get all transactions for a given farm
 * /finance/transaction/:id => get a transaction via its id
 * /finance/
 */
import { Router } from 'express'
import { initFinancePayment } from '../controllers/finance-controller'
import authenticator from '../middleware/auth/authenticator'

const financeRouter = Router()

financeRouter.get('finance/transaction', authenticator(), () => {
  // TODO
})
financeRouter.post('/finance/pay-order', initFinancePayment)

export default financeRouter
