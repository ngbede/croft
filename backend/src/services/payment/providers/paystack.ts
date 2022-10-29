import RestAdapter from '../../rest-adapter'
import { paystackTxnSchema } from '../../../schema/payment-schema'

interface customer {
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
}

export default class PaystackInterface {
  private restAdapter: RestAdapter
  private endpoints = {
    transaction: '/transaction',
    initTransaction: '/transaction/initialize',
    verifyTransaction: '/transaction/verify',
    customer: '/customer',
    identification: '/identification',
    validate: '/bank/validate'
  }

  constructor(restAdapter: RestAdapter) {
    this.restAdapter = restAdapter
  }

  async initiatePayment(paymentData: object) {
    return this.restAdapter.create(this.endpoints.initTransaction, paymentData)
  }

  async verifyPayment(reference: string) {
    const url = `${this.endpoints.verifyTransaction}/${reference}`
    return this.restAdapter.read(url)
  }

  // TODO: add pagination logic
  async listAllTransactions() {
    return this.restAdapter.read<paystackTxnSchema[]>(this.endpoints.transaction)
  }

  async getTransaction(id: string) {
    const url = `${this.endpoints.transaction}/${id}`
    return this.restAdapter.read(url)
  }

  async createCustomer(customerData: customer) {
    return this.restAdapter.create(this.endpoints.customer, customerData)
  }

  async listAllCustomers() {
    return this.restAdapter.read(this.endpoints.customer)
  }

  async getCustomer(id: string) {
    const url = `${this.endpoints.customer}/${id}`
    return this.restAdapter.read(url)
  }

  async updateCustomer(id: string, customerData: customer) {
    const url = `${this.endpoints.customer}/${id}`
    return this.restAdapter.put(url, customerData)
  }

  async validateCustomer(id: string, customerData: object) {
    const url = `${this.endpoints.customer}/${id}${this.endpoints.identification}`
    return this.restAdapter.create(url, customerData)
  }

  async validateAccount(accountData: object) {
    return this.restAdapter.create(this.endpoints.validate, accountData)
  }
}
