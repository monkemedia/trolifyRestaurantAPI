const Merchant = require('../models/merchant')
const emailTemplate = require('../utils/emailTemplate')

const createMerchant = async (req, res) => {
  const data = req.body
  const { email, name, role, store_hash, type } = data
  const merchantExists = await Merchant.findByEmailAddress(email)

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'merchant_credentials') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!email) {
    return res.status(401).send({
      message: 'Email is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!role) {
    return res.status(401).send({
      message: 'Role is required'
    })
  }

  if (!store_hash) {
    return res.status(401).send({
      message: 'Store hash is required'
    })
  }

  if (merchantExists) {
    return res.status(401).send({
      message: 'Merchant already exists'
    })
  }

  try {
    const merchant = new Merchant(data)
    const activateToken = await merchant.generateToken('1hr')

    merchant.reset_token = activateToken
    await merchant.save()

    emailTemplate.activateAccount({
      email,
      name,
      activateToken
    })
    await merchant.save()

    const merchantCopy = Object.assign(data, {
      password: false
    })

    res.status(201).send(merchantCopy)
  } catch (err) {
    res.status(err.status).send(err)
  }
}

const getMerchants = async (req, res) => {
  const merchant = await Merchant
    .aggregate()
    .project({
      name: 1,
      email: 1,
      enabled: 1,
      role: 1,
      store_hash: 1,
      password: { $toBool: '$password' }
    })

  res.status(200).send(merchant)
}

const getMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.merchantId }).select('-reset_token -refresh_token')

    if (!merchant) {
      return res.status(401).send({
        message: 'Merchant does not exist'
      })
    }
    const merchantClone = Object.assign(merchant, {
      password: !!merchant.password
    })

    res.status(200).send(merchantClone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateMerchant = async (req, res) => {
  const merchantId = req.params.merchantId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'merchant_credentials') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    if (data.password) {
      await Merchant.updateMerchantWithPassword(merchantId, data)
    } else {
      await Merchant.updateMerchant(merchantId, data)
    }
    const merchant = await Merchant.findOne({ _id: merchantId })
      .select('-reset_token -refresh_token')

    const merchantClone = Object.assign(merchant, {
      password: !!merchant.password
    })

    res.status(200).send(merchantClone)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteMerchant = async (req, res) => {
  try {
    await Merchant.deleteMerchant(req.params.merchantId)

    res.status(200).send({
      message: 'Merchant successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const resendActivationEmail = async (req, res) => {
  try {
    const data = req.body
    const { type, name, email } = data

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'merchant_credentials') {
      return res.status(401).send({
        message: 'Correct type is required'
      })
    }

    const merchant = await Merchant.findOne({ _id: req.params.merchantId }).select('-password')
    const activateToken = await merchant.generateToken('1hr')

    merchant.reset_token = activateToken
    await merchant.save()
    emailTemplate.activateAccount({
      email,
      name,
      activateToken
    })
    res.status(200).send({
      message: 'Activation email successfully sent'
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
}

module.exports = {
  createMerchant,
  getMerchants,
  getMerchant,
  updateMerchant,
  deleteMerchant,
  resendActivationEmail
}
