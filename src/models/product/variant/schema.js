const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Object,
    required: true
  },
  sale_price: {
    type: Object,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String,
    default: ''
  },
  sort_order: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    default: ''
  },
  product_id: {
    type: String,
    required: true
  },
  option_values: [
    {
      _id: false,
      id: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      option_id: {
        type: String,
        default: ''
      },
      option_display_name: {
        type: String,
        default: ''
      }
    }
  ]
}, { versionKey: false })

module.exports = productVariantSchema
