
const Product = require('../../models/product')
const currencySymbol = require('currency-symbol-map')
const errorHandler = require('../../utils/errorHandler')

const createProduct = async (req, res) => {
  const customer_id = req.params.customerId
  const data = req.body
  const {
    type,
    name,
    slug,
    sku,
    stock,
    status,
    description,
    price,
    sale_price,
    on_sale,
    commodity_type
  } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!slug) {
    return res.status(401).send({
      message: 'Slug is required'
    })
  }

  if (!sku) {
    return res.status(401).send({
      message: 'SKU is required'
    })
  }

  if (isNaN(stock)) {
    return res.status(401).send({
      message: 'Stock is required'
    })
  }

  if (typeof stock !== 'number') {
    return res.status(401).send({
      message: 'Stock requires a number'
    })
  }

  if (!status) {
    return res.status(401).send({
      message: 'Status is required'
    })
  }

  if (status !== 'draft' && status !== 'live') {
    return res.status(401).send({
      message: 'Status must be either `draft` or `live`'
    })
  }

  if (!description) {
    return res.status(401).send({
      message: 'Description is required'
    })
  }

  if (!price) {
    return res.status(401).send({
      message: 'Price is required'
    })
  }

  if (price && typeof price !== 'object') {
    return res.status(401).send({
      message: 'Price requires an object'
    })
  }

  if (isNaN(price.amount)) {
    return res.status(401).send({
      message: 'Price amount is required'
    })
  }

  if (!isNaN(price.amount) && typeof price.amount !== 'number') {
    return res.status(401).send({
      message: 'Price amount requires a number'
    })
  }

  if (!price.currency) {
    return res.status(401).send({
      message: 'Price currency is required'
    })
  }

  if (!currencySymbol(price.currency)) {
    return res.status(401).send({
      message: 'Price currency is not a 3 letter ISO'
    })
  }

  if (sale_price && typeof sale_price !== 'object') {
    return res.status(401).send({
      message: 'Sale price requires an object'
    })
  }

  if (sale_price && isNaN(sale_price.amount)) {
    return res.status(401).send({
      message: 'Sale price amount is required'
    })
  }

  if (sale_price && !isNaN(sale_price.amount) && typeof sale_price.amount !== 'number') {
    return res.status(401).send({
      message: 'Sale price amount requires a number'
    })
  }

  if (sale_price && !sale_price.currency) {
    return res.status(401).send({
      message: 'Sale price currency is required'
    })
  }

  if (sale_price && !currencySymbol(sale_price.currency)) {
    return res.status(401).send({
      message: 'Sale price currency is not a 3 letter ISO'
    })
  }

  if (on_sale && typeof on_sale !== 'boolean') {
    return res.status(401).send({
      message: 'On sale requires a boolean'
    })
  }

  if (!commodity_type) {
    return res.status(401).send({
      message: 'Commodity Type is required'
    })
  }

  if (commodity_type !== 'physical' && commodity_type !== 'digital') {
    return res.status(401).send({
      message: 'Commodity Type should be either physical or digital types'
    })
  }

  try {
    const products = new Product({ ...data, customer_id })

    await products.save()

    res.status(201).send(products)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getProducts = async (req, res) => {
  try {
    const query = req.query.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    let products

    if (query) {
      products = await Product.search({ page, query })
    } else {
      products = await Product.findProducts({ page, limit })
    }
    res.status(200).send(products)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProduct = async (req, res) => {
  const productId = req.params.productId
  const product = await Product.findProduct(productId)

  res.status(200).send(product)
}

const updateProduct = async (req, res) => {
  const productId = req.params.productId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const product = await Product.updateProduct(productId, data)

    res.status(200).send(product)
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteProduct(req.params.productId)

    res.status(200).send({
      message: 'Product successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}
