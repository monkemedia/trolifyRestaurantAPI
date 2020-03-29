const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../../utils/errorHandler')
const customerSchema = require('./schema.js')

// Hash the password before saving the customer model
customerSchema.pre('save', async function (next) {
  const customer = this

  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8)
  }
  next()
})

// Generate an auth token for customer
customerSchema.methods.generateAccessToken = async function () {
  const customer = this
  const accessToken = jwt.sign({
    _id: customer.client_id
  }, process.env.CLIENT_SECRET, { expiresIn: '1h' })

  return accessToken
}

// Get customers
customerSchema.statics.findCustomers = async () => {
  const customers = await Customer.find({})

  return customers
}

// Search for a customer by email address
customerSchema.statics.findByEmail = async (email) => {
  const customer = await Customer.findOne({ email })

  return customer
}

// Search for a customer by email and password
customerSchema.statics.findByCredentials = async (email, password) => {
  const customer = await Customer.findOne({ email })

  if (!customer) {
    throw errorHandler(422, 'Customer does\'t exists')
  }

  const isPasswordMatch = await bcrypt.compare(password, customer.password)

  if (!isPasswordMatch) {
    throw errorHandler(422, 'Invalid login credentials')
  }

  return customer
}

// Update customer
customerSchema.statics.updateCustomer = async (customerDetails) => {
  const { _id, name, email } = customerDetails
  let { password } = customerDetails

  password = await bcrypt.hash(password, 8)
  const customer = await Customer.updateOne({ _id }, { name, email, password })
  return customer
}

// Delete customer by id
customerSchema.statics.deleteCustomer = async (_id) => {
  const customer = await Customer.deleteOne({ _id })
  return customer
}

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
