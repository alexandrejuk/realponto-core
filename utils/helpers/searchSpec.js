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
  mergeLeft,
  ifElse,
  equals,
  always,
  concat,
  prop,
  propOr,
} = require('ramda')
const Sequelize = require('sequelize')
const { Op } = Sequelize
const { gte, lte, like } = Op

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

const likeOperation = propName => values => {
  const propValue = propOr('', propName, values)
  if (isEmpty(propValue)) {
    console.log(propValue)
    return null
  }

  return ({
    [like]: concat(concat('%', propValue), '%')
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

const searchSpecs = {
  status: applySpec({
    id: pathOr(null, ['id']),
    activated: pathOr(null, ['activated']),
    label: likeOperation('label'),
    value: likeOperation('value'),
    color: ifElse(
      compose(
        isNil,
        Number,
        pathOr(null, ['color'])
      ),
      always(null),
      pipe(
        pathOr(null, ['color']),
        concat('#'),
      )
    ),
    type: pathOr(null, ['type']),
    typeLabel: pathOr(null, ['typeLabel']),
    createdAt: parserDateGteAndLte('createdAt'),
    updatedAt: parserDateGteAndLte('updatedAt'),
  }),
  user: applySpec({
    document: pathOr(null, ['document']),
    createdAt: parserDateGteAndLte('createdAt'),
    updatedAt: parserDateGteAndLte('updatedAt'),
  }),
  product: applySpec({
    activated: pathOr(null, ['activated']),
    name: likeOperation('name'),
    minQuantity: minQuantityParser('minQuantity'),
    createdAt: parserDateGteAndLte('createdAt'),
    updatedAt: parserDateGteAndLte('updatedAt'),
  }),
  order: {},
  serialNumber: {},
  customer: applySpec({
    name: likeOperation('name'),
    document: pathOr(null, ['document']),
    createdAt: parserDateGteAndLte('createdAt'),
    updatedAt: parserDateGteAndLte('updatedAt'),
  }),
}

const paginationSettings = whereSpec => applySpec({
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

const removeFieldsNilOrEmpty = values => {
  let fields = {}
  for (let key in values) {
    if (!isNil(values[key])) {
      if (key === 'where') {
        for (let whereKey in values[key]) {
          if (!isNil(values[key][whereKey])) {
            fields = {
              ...fields,
              [key]: mergeLeft(fields[key], { [whereKey]: values[key][whereKey] })
            }
          }
        }
      }
      else {
        fields = mergeLeft(fields, { [key]: values[key] })
      }
    }
  }

  return fields
}

const buildPagination = whereSpec => pipe(
  paginationSettings(whereSpec),
  removeFieldsNilOrEmpty,
)

module.exports = buildPagination
