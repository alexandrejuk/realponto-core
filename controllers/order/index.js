const {
  omit,
  pipe,
  prop,
  map,
  mergeDeepLeft,
  filter,
  propEq,
  reduce,
  has,
  pathOr,
} = require('ramda')
const database = require('../../database')
const OrderModel = database.model('order')
const TransactionModel = database.model('transaction')
const ProductModel = database.model('product')
const UserModel = database.model('user')
const SerialNumberModel = database.model('serialNumber')
const BalanceModel = database.model('balance')

const { parseStatusToType, relativeInverseStatus } = require('../../utils/database/transaction/transaction.enum')
const { getTotalStatusOfProduct } = require('../../utils/database/transaction/transaction.fuctions')

const include = [
  {
    model: TransactionModel,
    attributes: ['status', 'type', 'quantity', 'productId', 'id'],
    include: [{
      model: ProductModel,
      attributes: ['activated', 'name']
    }]
  },
  {
    model: UserModel,
    attributes: ['activated', 'name']
  },
  {
    model: SerialNumberModel,
    include: [{
      model: ProductModel,
      attributes: ['activated', 'name']
    }]
  }
]

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const orderPayload = omit(['products'], req.body)
  const orderStatus = pathOr(null, ['body', 'status'], orderPayload)
  const transactionPayload = pathOr([], ['body', 'products'], req)

  try {
    if (parseStatusToType[orderStatus] === 'outputs') {
      await Promise.all(transactionPayload.map(async ({ productId, quantity }) => {
        const findQuantityProduct = await BalanceModel.findOne({
          where: { productId },
          include: [ProductModel],
          raw: true,
        })

        if (findQuantityProduct.quantity < quantity) {
          throw new Error(
            `Quantity sent major than quantity available to that product id: ${productId} product name: ${findQuantityProduct['product.name']}`
          )
        }
      }))
    }

    const response = await OrderModel.create(orderPayload, { transaction, include })
    const createTransaction = async (value) => {
      const transactionCreated = await TransactionModel.create(
        mergeDeepLeft(value, {
          orderId: prop('id', response),
          type: parseStatusToType[prop('status', value)],
        }),
        { transaction }
      )

      const updateBalance = await BalanceModel.findOne({ where: { productId: value.productId }})
      const quantityToBalance = (
        parseStatusToType[prop('status', value)] === 'outputs'
        ? (transactionCreated.quantity * -1)
        : transactionCreated.quantity
      )

      await updateBalance.update({ quantity: updateBalance.quantity + quantityToBalance })
      return transactionCreated
    }

    await Promise.all(map(createTransaction, transactionPayload))
    await response.reload({ include, transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const transaction = await database.transaction()
  const orderId = pathOr(null, ['params', 'id'], req)
  const transactionsPayload = pathOr([], ['body', 'products'], req)
  const pending_review = pathOr(null, ['body', 'pending_review'], req)

  try {
    const response = await OrderModel.findByPk(req.params.id, { include })

    if (transactionsPayload.length > 0) {
      await Promise.all(transactionsPayload.map(async (transactionPayload) => {
        const transactionStatus = prop('status', transactionPayload)
        let addTransaction = null
        const totalStatus = pipe(
          prop('transactions'),
          filter(propEq('productId', prop('productId', transactionPayload))),
          reduce(getTotalStatusOfProduct, {}),
          prop(prop('productId', transactionPayload)),
        )(response)

        const compareTotalValue = (
          (totalStatus[transactionStatus] + transactionPayload.quantity)
          <= totalStatus[relativeInverseStatus[transactionStatus]]
        )

        if (compareTotalValue) {
          addTransaction = await TransactionModel.create(
            mergeDeepLeft(transactionPayload, {
              orderId,
              type: parseStatusToType[transactionStatus],
            }),
            { transaction }
          )
        }

        return addTransaction
      }))
    }

    if (has('pending_review', { pending_review })) {
      await response.update({ pending_review }, { transaction, include })
    }

    await response.reload({ include, transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await OrderModel.findByPk(req.params.id, { include })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  try {
    const response = await OrderModel.findAll({ include })
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
