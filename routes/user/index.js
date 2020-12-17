const router = require('express').Router()
const { userController } = require('../../controllers')

router.post('/users', userController.create)
router.get('/users', userController.getAll)
router.get('/users/:id', userController.getById)
router.put('/users/:id', userController.update)

module.exports = router
