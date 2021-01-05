const { pathOr, omit } = require('ramda')
const { hash } = require('bcrypt')
const database = require('../../database')
const CompanyModel = database.model('company')
const UserModel = database.model('user')

const create = async (req, res, next) => {
  const transaction = await database.transaction()
  const company = omit(['user'], req.body)
  const user = pathOr(null, ['body', 'user'], req)

  try {
    const password = await hash(user.password, 10)
    const response = await CompanyModel.create(company, { transaction })
    await UserModel.create({
      ...user,
      password,
      companyId: response.id,
    }, { transaction })

    res.json(response)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    res.status(400).json({ error: error.message })
  }
}

const getById = async (req, res, next) => {
  try {
    const response = await CompanyModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  create,
  getById,
}
