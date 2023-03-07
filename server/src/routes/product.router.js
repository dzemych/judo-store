const { Router } = require('express')
const { getAll } = require('../controllers/handlerFactory')
const Product = require('../db/product.model')
const productController = require('../controllers/product.controller')


const router = Router()

router.get('/', getAll(Product))
router.post('/', productController.createOneProduct)

router
   .route('/:slug')
   .get(productController.getOne)
   .patch(productController.updateOne)
   .delete(productController.deleteOne)

module.exports = router