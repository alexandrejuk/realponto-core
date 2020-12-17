const database = require('../../database')
const TransactionModel = database.model('transaction')

const getById = async (req, res, next) => {
  try {
    const response = await TransactionModel.findByPk(req.params.id)
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAll = async (req, res, next) => {
  try {
    const response = await TransactionModel.findAll()
    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getById,
  getAll,
}
