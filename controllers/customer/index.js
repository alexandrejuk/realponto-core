const { pathOr } = require('ramda')
const database = require('../../database')
const CustomerModel = database.model('customer')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('customer')

const create = async (req, res, next) => {
  const customer = pathOr({}, ['body'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CustomerModel.create({
      ...customer,
      companyId,
    })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CustomerModel.findOne({ where: { companyId, id, }})
    await response.update(req.body)
    await response.reload()

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  const id = pathOr(null, ['params', 'id'], req)
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  try {
    const response = await CustomerModel.findOne({ where: { companyId, id, }})
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const companyId = pathOr(null, ['decoded', 'user', 'companyId'], req)
  const query = buildSearchAndPagination({
    ...pathOr({}, ['query'], req),
    companyId,
  })
  try {
    const { count, rows } = await CustomerModel.findAndCountAll(query)
    res.json({ total: count, source: rows })
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
