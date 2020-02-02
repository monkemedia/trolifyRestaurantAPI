const mongoose = require('mongoose')
const Schema = mongoose.Schema

const variantSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = variantSchema
