const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  address: {
    type: String
  },
  country_code: {
    type: String
  },
  phone: {
    type: String
  },
  admin_email: {
    type: String
  },
  order_email: {
    type: String
  },
  is_price_entered_with_tax: {
    type: Boolean,
    default: false
  },
  tax_label: {
    type: String
  },
  tax_percentage: {
    type: Number,
    default: 0
  },
  stripe_publishable_key: {
    type: String,
    default: ''
  },
  stripe_secret_key: {
    type: String,
    default: ''
  },
  language: {
    type: String
  },
  currency_code: {
    type: String
  },
  weight_unit: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = StoreSchema
