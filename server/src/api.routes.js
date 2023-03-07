const {Router} = require('express')
const productRouter = require('./routes/product.router')
const authRouter = require('./routes/auth.router')
const tempImgRouter = require('./routes/tempImg.router')
const dataRouter = require('./routes/data.router')
const { protectAndSetId } = require('./controllers/auth.controller')


const router = Router()

// Only admin can perform POST, PATH, DELETE requests
router.use('/', async (req, res, next) => {
   // const isChange = req.method.match(/(post|patch|delete)/i)
   // const noCheck = req.originalUrl.match(/auth\/(login|forgotPassword)/)
   //
   // if (isChange && !noCheck)
   //    await protectAndSetId(req, res, next)
   // else
      next()
})

router.use('/product', productRouter)
router.use('/auth', authRouter)
router.use('/img', tempImgRouter)
router.use('/data', dataRouter)

router.use('*', (req, res) => {
   res.status(404).json({
      ok: false,
      status: 'fail',
      message: 'This route is not yet defined.'
   })
})


module.exports = router