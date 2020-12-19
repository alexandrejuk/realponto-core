const { omit, pathOr } = require('ramda')
const database = require('../../database')
const UserModel = database.model('user')
const { hash, compare } = require('bcrypt')
const buildPagination = require('../../utils/helpers/searchSpec')
const buildSearchAndPagination = buildPagination('user')

const create = async (req, res, next) => {
  try {
    const password = await hash(req.body.password, 10)
    const response = await UserModel.create({ ...req.body, password })
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const update = async (req, res, next) => {
  const userWithoutPwd = omit(['password'], req.body)
  const userId = pathOr(null, ['params', 'id'], req)
  try {
    const response = await UserModel.findByPk(userId)
    await response.update(userWithoutPwd)
    await response.reload()

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await UserModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  const query = buildSearchAndPagination(pathOr({}, ['query'], req))
  try {
    const { count, rows } = await UserModel.findAndCountAll(query)
    res.json({ total: count, source: rows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updatePassword = async (req, res, next) => {
  const password = pathOr(null, ['body', 'password'], req)
  const newPassword = pathOr(null, ['body', 'newPassword'], req)
  const userId = pathOr(null, ['params', 'id'], req)

  try {
    const response = await UserModel.findOne({ where: { id: userId, activated: true }})
    const checkedPassword = await compare(password, response.password)

    if(!checkedPassword) {
      throw new Error('Password do not match with password saved')
    }

    const passwordhash = await hash(newPassword, 10)
    await response.update({ password: passwordhash })
    await response.reload()

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
  updatePassword,
}
