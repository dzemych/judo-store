const { Router } = require('express')
const catchAsync = require('./utils/catchAsync')
const path = require("path")
const crypto = require("crypto")
const jwtCheck = require('./middlewares/jwtCheck.middleware')
const User = require("./db/user.model")


const router = Router()

const sendEmailError = async (res, item) => {
   if (item) {
      item.confirmTokenCreated = undefined
      item.confirmToken = undefined
      item.emailCandidate = undefined

      await item.save()
   }

   res.sendFile(path.resolve('src/html/emailError.html'))
}

const confirmController = catchAsync(async (req, res, next) => {
   const confirmToken = crypto
      .createHash('sha256')
      .update(req.params.hash)
      .digest('hex')

   const item = await User.findOne({ confirmToken })

   if (!item)
      return sendEmailError(res)

   const created = item.confirmTokenCreated.getTime()

   if ((created + 3 * 24 * 60 * 60 * 1000) < Date.now())
      return sendEmailError(res, item)

   item.email = item.emailCandidate
   item.confirmTokenCreated = undefined
   item.confirmToken = undefined
   item.emailCandidate = undefined

   await item.save({ new: true })

   res.sendFile(path.resolve('src/html/successEmail.html'))
})

const setCspForMain = (req, res, next) => {
   res.set('Content-Security-Policy',
      "default-src http: blob: https: 'unsafe-inline';" +
      "img-src http: https: data: blob: 'unsafe-inline';" +
      "script-src http: blob: https: data:")

   next()
}

const setCspForAuth = (req, res, next) => {
   res.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' ")
   next()
}

router.use(setCspForAuth)

router.use('/confirmEmail/:hash', confirmController)

router.use(
   '/',
   jwtCheck,
   setCspForMain
)

module.exports = router