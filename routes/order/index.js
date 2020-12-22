const router = require('express').Router()
const { orderController } = require('../../controllers')

router.post('/orders', orderController.create)
router.get('/orders-summary', orderController.getSummaryToChart)
router.get('/orders', orderController.getAll)
router.get('/orders/:id', orderController.getById)
router.put('/orders/:id', orderController.update)

module.exports = router
