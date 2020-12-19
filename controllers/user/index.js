const { omit, pathOr } = require('ramda')
const database = require('../../database')
const UserModel = database.model('user')
const { hash } = require('bcrypt')

const create = async (req, res, next) => {
  try {
    const password = await hash(req.body.password, 10)
    const response = await UserModel.create({ ...req.body, password })
    res.json(response)
  } catch (error) {
    console.log(error)
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
  try {
    const response = await UserModel.findAll()
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
