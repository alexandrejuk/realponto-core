const {
  pathOr,
  map,
  omit,
  propEq,
  isEmpty,
} = require('ramda')
const database = require('../../database')
const OrderModel = database.model('order')
const TransactionModel = database.model('transaction')
const ProductModel = database.model('product')
const UserModel = database.model('user')
const SerialNumberModel = database.model('serialNumber')
const BalanceModel = database.model('balance')
const StatusModel = database.model('status')
const OrderProductModel = database.model('orderProduct')
const CustomerModel = database.model('customer')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('order')
const Sequelize = require('sequelize')
const { parserSummaryData, getStatusSummary } = require('../../utils/helpers/summaryDataParser')

const includeValues = [
  {
    model: CustomerModel,
    attributes: ['name', 'document']
  },
  {
    model: UserModel,
    attributes: ['name', 'activated']
  },
  {
    model: StatusModel,
    attributes: [ 'value', 'color', 'typeLabel']
  },
  {
    model: TransactionModel,
    attributes: ['quantity', 'id'],
    include: [
      {
        model: ProductModel,
        attributes: ['name', 'activated'],
      },
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel']
      },
      {
        model: UserModel,
        attributes: ['name', 'activated']
      }
    ],
  },
]

const include = [
  {
    model: UserModel,
    attributes: ['name', 'activated']
  },
  {
    model: CustomerModel,
    attributes: ['name']
  },
  {
    model: StatusModel,
    attributes: [ 'value', 'color', 'typeLabel']
  },
  {
    model: SerialNumberModel,
    attributes: ['id', 'serialNumber', 'activated', 'transactionInId', 'transactionOutId'],
    include: [
      {
        model: ProductModel,
        attributes: ['id', 'name', 'activated'],
      },
      {
        model: UserModel,
        attributes: ['id', 'name', 'activated']
      },
    ]
  },
  {
    model: TransactionModel,
    attributes: ['quantity', 'id', 'productId'],
    include: [
      {
        model: ProductModel,
        attributes: ['name', 'activated'],
      },
      {
        model: UserModel,
        attributes: ['name', 'activated']
      },
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel']
      },
    ]
  },
  {
    model: OrderProductModel,
    include: [
      {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel']
      },
    ]
  }
]

const statusBlockOnCreate = {
  analysis_return: true,
  booking_return: true,
  pending_analysis: true,
}

const quantityTotalProducts = (curr, prev) => {
  const findCurrent = curr.find(propEq('productId', prev.productId))

  if (findCurrent) {
    const sumQuantity = product => ({
      ...product,
      quantity: product.quantity + prev.quantity,
    })

    curr = curr.map(sumQuantity)
  }

  if (!findCurrent) {
    curr = [
      ...curr,
      {
        productId: prev.productId,
        quantity: prev.quantity
      }
    ]
  }

  return curr
}

const updateBalance = typeEvent => async ({
  productId,
  quantity,
  companyId,
}) => {
  const productBalance = await BalanceModel.findOne({ where: { productId, companyId }})
  if (productBalance) {
    await productBalance.update({
      quantity: (
        typeEvent === 'outputs'
          ? productBalance.quantity - quantity
          : productBalance.quantity + quantity
      )
    })
    await productBalance.reload()
    return productBalance
  }
}

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const statusId = pathOr(null, ['body', 'statusId'], req)
  const customerId = pathOr(null, ['body', 'customerId'], req)
  const userId = pathOr(null, ['body', 'userId'], req)
  const createdBy = pathOr('us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c', ['decoded', 'user', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const pendingReview = pathOr(false, ['body', 'pendingReview'], req)
  const products = pathOr([], ['body', 'products'], req)

  try {
    const findStatus = await StatusModel.findByPk(statusId, { raw: true })

    if (!findStatus) {
      // se o status não estiver cadastrado não podemos criar a ordem
      throw new Error('status not register!')
    }

    if (statusBlockOnCreate[findStatus.label]) {
      // nesse caso não podemos criar uma ordem por que o restorno da reserva
      // tem que ser feito diretamente na ordem criada
      throw new Error(`cannot create a order with status ${findStatus.label}!`)
    }

    console.log('userId', userId,customerId)
    if (findStatus.label !== 'booking' && !userId && !customerId ) {
      // somente ordens com o status booking pode ser criada sem usuário ou
      // cliente
      throw new Error(`cannot create a order without user or customer to status ${findStatus.label}!`)
    }


    if(products.length === 0) {
      // toda ordem precisa ter pelo menos um produto
      throw new Error('do you need add almost a product!')
    }

    const response = await OrderModel.create({
      statusId,
      userId,
      customerId,
      pendingReview,
      companyId,
    }, { transaction, include })

    const orderId = response.id

    const formmatProduct = product => omit(['productName'], ({
      ...product,
      orderId,
      userId: createdBy,
      companyId,
    }))

    const productOrder = (product) => ({
      ...product,
      userId: createdBy,
      orderId: response.id,
      companyId,
    })

    const productsPayload = map(formmatProduct, products)
    const orderProductsPayload = map(productOrder, products)
    const productsTotal = products.reduce(quantityTotalProducts, [])

    await TransactionModel.bulkCreate(productsPayload, { transaction })
    await OrderProductModel.bulkCreate(orderProductsPayload, { transaction })
    await Promise.all(map(updateBalance(findStatus.type), productsTotal))
    await response.reload({ include, transaction })
    await transaction.commit()
    res.json(response)
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)

}

const getById = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await OrderModel.findOne({ where: { companyId, id: req.params.id }}, { include })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const { where, offset, limit } = buildSearchAndPagination({
    ...req.query,
    companyId,
  })
  const setWhereOnInclude = includeValues.map(includeValue => {
    const wheres = omit(['orderWhere'], where)
    const includeWhereAdd = wheres[includeValue.model.name]
    if(isEmpty(includeWhereAdd)) {
      return includeValue
    }

    if(!isEmpty(includeWhereAdd) && includeValue.model.name === 'transaction') {
      return {
        ...includeValue,
        include: [
          {
            model: ProductModel,
            attributes: ['name', 'activated'],
            where: includeWhereAdd
          },
          {
            model: UserModel,
            attributes: ['name', 'activated']
          },
          {
            model: StatusModel,
            attributes: [ 'value', 'color', 'typeLabel']
          },
        ]
      }
    }

    return ({
      ...includeValue,
      where: includeWhereAdd,
    })
  })

  const orderWhere = (
    isEmpty(where.orderWhere)
      ? {}
      : { where: where.orderWhere }
  )

  try {
    const { rows } = await OrderModel.findAndCountAll({
      ...orderWhere,
      include: setWhereOnInclude,
      offset,
      limit,
    })
    res.json({ total: rows.length, source: rows })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}


const getSummaryToChart = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const { where, offset, limit } = buildSearchAndPagination(req.query)

  const orderWhere = (
    isEmpty(where.orderWhere)
      ? {}
      : { where: where.orderWhere }
  )
  try {
    const { rows } = await OrderModel.findAndCountAll({
      ...orderWhere,
      include: {
        model: StatusModel,
        attributes: [ 'value', 'color', 'typeLabel', 'type', 'label', 'id']
      },
      attributes: [
        [Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')), 'name'],
        [Sequelize.fn('COUNT', Sequelize.col('order.createdAt')), 'count']
      ],
      group: [
        Sequelize.fn('date_trunc', 'day', Sequelize.col('order.createdAt')),
        'status.id'
      ],
      offset,
      limit,
      raw: true,
    })
    res.json({ source: parserSummaryData(rows), chartSettings: getStatusSummary(rows) })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message })
  }
}
module.exports = {
  create,
  update,
  getById,
  getAll,
  getSummaryToChart,
}
