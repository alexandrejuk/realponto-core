const moment = require('moment')
const {
  applySpec,
  pathOr,
  pipe,
  subtract,
  isNil,
  isEmpty,
  multiply,
  compose,
  ifElse,
  equals,
  always,
  concat,
  prop,
  propOr,
} = require('ramda')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { gte, lte, iLike } = Op

const calculatorOffset = values => {
  const pageOffset = pipe(pathOr(1, ['page']), Number)(values)
  const limit = pipe(pathOr(25, ['limit']), Number)(values)
  const offsetSubOne = subtract(pageOffset, 1)
  return multiply(offsetSubOne)(limit)
}

const parserDateToMoment = type => value => {
  let dateParser = moment(value).startOf('day').utc().toISOString()

  if (type === 'end') {
    dateParser = moment(value).endOf('day').utc().toISOString()
  }

  return dateParser
}

const minQuantityParser = propName => values => {
  const propValue = propOr(null, propName, values)
  if (isNil(propValue)) {
    return null
  }

  return Number(propValue)
}

const iLikeOperation = propName => values => {
  const propValue = propOr('', propName, values)
  if (isEmpty(propValue)) {
    console.log(propValue)
    return null
  }

  return ({
    [iLike]: concat(concat('%', propValue), '%')
  })
}

const parserDateGteAndLte = propName => values => {
  const propValue = pathOr(null, [propName], values)
  if (isNil(propValue)) {
    return null
  }

  return ({
    [gte]: pipe(
      prop(propName),
      parserDateToMoment('start')
    )(values),
    [lte]: pipe(
      prop(propName),
      parserDateToMoment('end')
    )(values)
  })
}

const parserDateGteAndLteForCreatedAt = values => {
  const intialDate = pipe(
    pathOr(null, ['initialDate']),
    parserDateToMoment('start')
  )(values)

  const finalyDate = pipe(
    pathOr(null, ['finalyDate']),
    parserDateToMoment('end')
  )(values)

  if (isNil(intialDate) && isNil(finalyDate)) {
    return null
  }

  return ({
    [gte]: intialDate,
    [lte]: finalyDate,
  })
}

const getColor = propName => values => {
  let color = pathOr(null, ['color'], values)
  if (color) {
    return concat('#', color)
  }

  return null
}

const removeFiledsNilOrEmpty = values => {
  const fields = values
  const fieldFormmat = Object.keys(fields)
  .reduce((curr, prev) => {
    if (!curr[prev] && fields[prev]) {
      if (fields[prev] == 'true') {
        curr = {
          ...curr,
          [prev]: true
        }
      }

      if(fields[prev] == 'false') {
        curr = {
          ...curr,
          [prev]: false
        }
      }

      if(fields[prev] != 'true' && fields != 'false') {
        curr = {
          ...curr,
          [prev]: fields[prev]
        }
      }
    }
    return curr
  }, {})

  return fieldFormmat
}

const orderSpec = applySpec({
  user: pipe(
    applySpec({
      name: iLikeOperation('user_name'),
    }),
    removeFiledsNilOrEmpty
  ),
  customer: pipe(
    applySpec({
      name: iLikeOperation('customer_name'),
      document: pathOr(null, ['customer_document']),
    }),
    removeFiledsNilOrEmpty,
  ),
  status: pipe(
    applySpec({
      value: iLikeOperation('status_value'),
      typeLabel: pathOr(null, ['status_typeLabel']),
    }),
    removeFiledsNilOrEmpty
  ),
  transaction: pipe(
    applySpec({
      name: iLikeOperation('product_name'),
    }),
    removeFiledsNilOrEmpty
  ),
  orderWhere: pipe(
    applySpec({
      pendingReview: pathOr(null, ['pendingReview']),
      createdAt: parserDateGteAndLteForCreatedAt,
      updatedAt: parserDateGteAndLte('updatedAt'),
    }),
    removeFiledsNilOrEmpty
  ),
})

const searchSpecs = {
  status: pipe(
    applySpec({
      id: pathOr(null, ['id']),
      activated: pathOr(null, ['activated']),
      label: iLikeOperation('label'),
      value: iLikeOperation('value'),
      color: getColor('color'),
      type: pathOr(null, ['type']),
      typeLabel: pathOr(null, ['typeLabel']),
      createdAt: parserDateGteAndLte('createdAt'),
      updatedAt: parserDateGteAndLte('updatedAt'),
    }),
    removeFiledsNilOrEmpty
  ),
  user: pipe(
    applySpec({
      name: iLikeOperation('name'),
      document: pathOr(null, ['document']),
      createdAt: parserDateGteAndLte('createdAt'),
      updatedAt: parserDateGteAndLte('updatedAt'),
    }),
    removeFiledsNilOrEmpty,
  ),
  product: pipe(
    applySpec({
      activated: pathOr(null, ['activated']),
      name: iLikeOperation('name'),
      minQuantity: minQuantityParser('minQuantity'),
      createdAt: parserDateGteAndLte('createdAt'),
      updatedAt: parserDateGteAndLte('updatedAt'),
    }),
    removeFiledsNilOrEmpty,
  ),
  order: orderSpec,
  serialNumber: {},
  customer: pipe(
    applySpec({
      name: iLikeOperation('name'),
      document: pathOr(null, ['document']),
      createdAt: parserDateGteAndLte('createdAt'),
      updatedAt: parserDateGteAndLte('updatedAt'),
    }),
    removeFiledsNilOrEmpty,
  ),
}

const buildPagination = whereSpec => applySpec({
  offset: ifElse(
    compose(
      equals(0),
      Number,
      pathOr(0, ['page'])
    ),
    always(0),
    calculatorOffset
  ),
  limit: ifElse(
    compose(
      equals(0),
      Number,
      pathOr(25, ['limit'])
    ),
    always(25),
    pipe(
      pathOr(25, ['limit']),
      Number,
    )
  ),
  where: searchSpecs[whereSpec],
})

module.exports = buildPagination
