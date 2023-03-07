const User = require('../db/user.model')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Email = require('../utils/email')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const createJwt = email => {
   return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '60d'
   })
}

const cookieOptions = {
   secure: process.env.NODE_ENV === 'production',
   httpOnly: true
}

exports.changeEmail = catchAsync(async (req, res, next) => {
   const { email } = req.body

   if (!email)
      return next(new AppError('Provide email to update', 400))

   // 1) Update user if there is any
   // const item = await User
   //    .findByIdAndUpdate(req.userId, { emailCandidate: email })
   //    .select('email')

   const item = await User
      .findByIdAndUpdate(req.userId, { email })
      .select('email')

   if (!item)
      return next(new AppError('No user crated yet', 404))

   // 2) Create and get reset password token
   // const confirmHash = await item.createConfirmHash()

   // 3) Send confirm link
   // await new Email(
   //    email,
   //    `${curProtocol}://${curHost}/admin/confirmEmail/` + confirmHash
   // ).sendConfirm(item.email)

   res.json({
      ok: true,
      status: 'success',
      message: 'Link to confirm new email was sent to email'
   })
})

exports.changePassword = catchAsync(async (req, res, next) => {
   const { oldPassword, newPassword, confirmNewPassword } = req.body

   // 1) Check if necessary fields are provided
   if (!oldPassword)
      return next(new AppError('Provide old password', 409))

   // 2) Check if there is such user
   const user = await User.findById(req.userId).select('+password')
   if (!user)
      return next(new AppError('No user with that email', 404))

   // 3) Password check
   const pwdCheck = await bcrypt.compare(oldPassword, user.password)
   if (!pwdCheck)
      return next(new AppError('Invalid old password', 401))

   user.password = newPassword
   user.passwordConfirm = confirmNewPassword

   await user.save({ new: true })

   res.json({
      ok: true,
      status: 'success',
      message: 'Password successfully updated',
      user
   })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
   const email = req.body.email
   if (!email)
      return next(new AppError('Provide user email', 400))

   // 1) Check if there is user with such email
   const user = await User.findOne({ email })
   if (!user)
      return next(new AppError('No user found with such email', 404))

   // 2) Create and get reset password token
   const resetHash = await user.createResetToken()

   // 3) Send reset password mail
   await new Email(
      email,
      'http://localhost:5000/api/auth/resetPassword/' + resetHash
   ).sendReset()

   res.json({
      ok: true,
      message: 'Reset password link was sent to email'
   })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
   const { token, password, passwordConfirm } = req.body

   if (!token || !password || !passwordConfirm)
      return next(new AppError('Provide token, password and passwordConfirm', 400))

   // 1) Get encrypted token that is stored in db from req hash
   const resetToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex')

   // 2) Find user with this token
   const user = await User.findOne({ resetToken: resetToken })

   if (!user)
      return next(new AppError('Invalid confirm token', 403))

   // 3) If token is outdated return error
   const createdAt = new Date(user.resetTokenCreated).getTime()

   if ((createdAt + 2 * 60 * 60 * 1000) < Date.now())
      return next(new AppError('Expired token, please reset password again', 403))

   // 4) Change password and clear token
   user.password = password
   user.passwordConfirm = passwordConfirm
   user.resetToken = undefined
   user.resetTokenCreated = undefined

   await user.save()

   res.json({
      ok: true,
      message: 'Password has been changed, now log in with the new password'
   })
})

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body
   // 1) Check if necessary fields are provided
   if (!email || !password)
      return next(new AppError('Provide both email and password', 400))

   // If no users create
   const allUsers = await User.find().lean().count()
   if (allUsers) {
      // 1) Check if there is such user
      const user = await User.findOne({ email }).select('password email').lean()

      if (!user)
         return next(new AppError('Invalid email or password', 404))

      // 2) Check password
      const pwdCheck = await bcrypt.compare(password, user.password)

      if (!pwdCheck)
         return next(new AppError('Invalid email or password', 400))

      // 3) If everything ok create and send token to client
      const token = createJwt(email)

      res.cookie('judo-novator-jwt', token, cookieOptions)
      res.json({
         ok: true,
         message: 'Logged in successfully',
         token, user: { email: user.email }
      })
   } else {
      await User.create({email, password, passwordConfirm: password})
      const token = createJwt(email)

      res.cookie('judo-novator-jwt', token, cookieOptions)
      res.json({
         ok     : true,
         message: 'Logged in successfully',
         token  : createJwt(email),
         user: { email }
      })
   }
})

exports.protectAndSetId = catchAsync(async (req, res, next) => {
   const jwtToken = req.cookies['judo-novator-jwt']

   // 1) Check if client provided authorization header
   if (!jwtToken)
      return next(new AppError('Please login', 401))

   // 2) Verify token
   let data
   try {
      data = jwt.verify(jwtToken, process.env.JWT_SECRET)
   } catch (e) {
      res.clearCookie('judo-novator-jwt')
      throw next(new AppError(e.message, 401))
   }

   // 3) Check if user exists with such email
   const user = await User.findOne({ email: data.email })

   if (!user) {
      res.clearCookie('judo-novator-jwt')
      return next(new AppError('Invalid token', 403))
   }

   // 4) Check if password hasn't been changed after token creation
   if (data.iat * 1000 < user.passwordChanged.getTime()) {
      res.clearCookie('judo-novator-jwt')
      return next(new AppError('Password has been changed after token creation', 403))
   }

   if (data.iat * 1000 < user.emailChanged.getTime()){
      res.clearCookie('judo-novator-jwt')
      return next(new AppError('Email has been changed after token creation', 403))
   }

   req.userId = user._id

   next()
})