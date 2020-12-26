const { pathOr } = require('ramda')
const database = require('../../database')

const SerialNumberModel = database.model('serialNumber')
const OrderModel = database.model('order')
const ProductModel = database.model('product')
const UserModel = database.model('user')

const include = [
  UserModel,
  ProductModel,
  OrderModel,
]

const create = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction = await database.transaction()

  const serial_numbers = pathOr([], ['body', 'serial_numbers'], req)
  const orderId = pathOr([], ['body', 'orderId'], req)
  const productId = pathOr([], ['body', 'productId'], req)
  const transaction_in_id = pathOr([], ['body', 'transaction_in_id'], req)
  const userId = pathOr(null, ['body', 'userId'], req)

  try {

    const findSerial = await SerialNumberModel.findOne({
      where: {
        serial_number,
        activated: true,
      },
      include
    })

    if (findSerial) {
      throw new Error('Allow only one serial number with same number activated!')
    }

    const response = await Promise.all(serial_numbers.map(async (serial_number) => {
      const serialCreated = await SerialNumberModel.create({
        serial_number,
        orderId,
        productId,
        transaction_in_id,
        userId,
      }, { include })

      return serialCreated
    }))

    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const transaction_out_id = pathOr(null, ['body', 'transaction_out_id'], req)
  const update_serial_number = pathOr(null, ['body', 'serial_number'], req)
  const serial_number = pathOr(null, ['params', 'serialNumber'], req)

  try {
    const response = await SerialNumberModel.findOne({
      where: {
        serial_number,
        activated: true,
      },
      include
    })

    if (response && transaction_out_id) {
      await response.update({
        transaction_out_id,
        activated: false,
      }, { include })
    }

    if (response && update_serial_number) {
      await response.update({
        serial_number: update_serial_number,
      }, { include })
    }

    await response.reload()

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const serial_number = pathOr(null, ['params', 'serialNumber'], req)
  try {
    const response = await SerialNumberModel.findOne({ where: { serial_number }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await SerialNumberModel.findAll({ include })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  update,
  getById,
  getAll,
}
