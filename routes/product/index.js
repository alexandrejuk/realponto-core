const router = require('express').Router()
const { productController } = require('../../controllers')

router.post('/products', productController.create)

module.exports = router
