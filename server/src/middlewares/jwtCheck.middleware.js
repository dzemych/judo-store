const catchAsync = require('../utils/catchAsync')
const path = require('path')
const jwt = require("jsonwebtoken");
const User = require("../db/user.model");


const sendLoginPage = (res) => {
   res.clearCookie('judo-novator-jwt')
   res.sendFile(path.resolve('src/html/auth.html'))
}

const jwtCheckMiddleware = catchAsync(async (req, res, next) => {
   const jwtToken = req.cookies['judo-novator-jwt']

   // 1) Check if client provided authorization header
   if (!jwtToken)
      return sendLoginPage(res)

   // 2) Verify token
   let data
   try {
      data = jwt.verify(jwtToken, process.env.JWT_SECRET)
   } catch (e) {
      return sendLoginPage(res)
   }

   // 3) Check if user exists with such email
   const user = await User.findOne({ email: data.email })

   if (!user)
      return sendLoginPage(res)

   // 4) Check if password hasn't been changed after token creation
   if (data.iat * 1000 < user.passwordChanged.getTime())
      return sendLoginPage(res)

   // 5) Check if email hasn't been changed after token creation
   if (data.iat * 1000 < user.emailChanged.getTime())
      return sendLoginPage(res)

   next()
})

module.exports = jwtCheckMiddleware