export interface paymentDebit {
  id: string
  order_uuid: string
  data: object
  amount: number
  payment_provider: string
  created_by: string
  created_at: string
  updated_at: string
  status: string
  error?: string
  order_id: string
  reference: string
  access_code: string
  is_paid: boolean
}

export interface paystackTxnSchema {
  id: number
  domain: string
  status: string
  reference: string
  amount: number
  message?: string
  gateway_response: string
  paid_at?: string
  created_at: string
  channel: string
  currency: string
  ip_address: string
  metadata?: object
  log: object
  fees: number
  fees_split: number
  customer: object
  authorization: object
  plan: object
  split: object
  subaccount: object
  order_id: string
  paidAt: string
  requested_amount: number
  source: object
  pos_transaction_data: null
}
