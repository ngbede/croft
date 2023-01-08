import PaystackInterface from './providers/paystack'
import RestAdapter from '../rest-adapter'
import { supabaseServer } from '../../db/init'
import { OrderStatus, PaystackTxnStatus } from '../../schema/enums'
import { order } from '../../schema/order-schema'
import { paymentDebit } from '../../schema/payment-schema'
import 'dotenv/config'

// table names
const paymentTableName = 'payment_debit'
const orderTableName = 'orders'

const paystackBaseUri = `${process.env.paystack_url}`
const paystackToken = `Bearer ${process.env.paystack_secret_key}`

const restAdapter: RestAdapter = new RestAdapter(paystackBaseUri, paystackToken)
const paystack: PaystackInterface = new PaystackInterface(restAdapter)

interface responsePattern {
  status: number
  message: string
  data?: object
}

export const initPayment = async (orderID: string): Promise<responsePattern> => {
  const { data, error } = await supabaseServer.from(orderTableName)
    .select('*')
    .match({ order_id: orderID, status: OrderStatus.packed })

  if (error) console.error(error)

  if (data && data.length > 0) {
    const orderDoc: order = data[0]
    const { data: userInfo, error } = await supabaseServer.auth.api.getUserById(orderDoc.created_by)
    const { total_amount: amount } = orderDoc
    const { email } = userInfo!
    if (error) console.error(error)

    try {
      const response = await paystack.initiatePayment({ email, amount })
      const { access_code, reference } = response.data.data
      const transformData = {
        order_uuid: orderDoc.id,
        order_id: orderDoc.order_id,
        data: response.data.data,
        amount: amount,
        payment_provider: 'paystack',
        created_by: orderDoc.created_by,
        access_code: access_code,
        reference: reference,
        status: 'pending',
      }
      const { data, error } = await supabaseServer.from(paymentTableName)
        .insert(transformData)
      if (error) console.error(error)
      return {
        status: 200,
        message: `Payment successfully initiated for order ${orderDoc.order_id}`,
        data: data![0]
      } as responsePattern
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  return { message: `Order doc with status 'packed' and id ${orderID} not found`, status: 404 } as responsePattern
}

export const updatePaymentStatus = async () => {
  const { data, error } = await supabaseServer.from<paymentDebit>(paymentTableName)
    .select('*')
    .in('status', [PaystackTxnStatus.pending, PaystackTxnStatus.abandoned])

  if (error) throw error

  if (data && data.length > 0) {
    try {
      // TODO: the transaction list endpoint has a return limit
      // could run into scenario where transaction data isn't included in given response
      const response = await paystack.listAllTransactions()
      console.log(response)
      const transformData = data.filter(debit => {
        const debitTransaction = response.data.find(t => t.reference === debit.reference)
        // update the status, data & error if any
        const { status, gateway_response: error } = debitTransaction!
        debit.status = status
        debit.error = error
        debit.data = debitTransaction!
        debit.updated_at = new Date().toJSON()
        debit.is_paid = status.toLowerCase() === PaystackTxnStatus.success
        return debit
      })
      const { data: saveDebits, error: saveErr } = await supabaseServer.from(paymentTableName)
        .upsert(transformData)
        .select()

      if (saveErr) throw saveErr

      return { message: `A total of ${saveDebits?.length} payment transaction data was updated`, status: 200 }
    } catch (error) {
      console.error(error)
    }
  }
}
