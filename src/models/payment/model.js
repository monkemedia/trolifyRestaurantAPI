const mongoose = require('mongoose')
const Stripe = require('stripe')
const paymentSchema = require('./schema')
const Store = require('../store')

// Create payment
paymentSchema.statics.createPayment = async ({ source, receipt_email, currency, amount }) => {
  const store = await Store().findOne()
  
  const payment = await Stripe(store.stripe_secret_key).charges.create({
    source,
    receipt_email,
    currency,
    amount
  })
  return payment
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
