const { Schema, model } = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('../utils/AppError')


const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: val => validator.isEmail(val),
        message: 'Invalid email'
      }
   },
   password: {
      type: String,
      required: true,
      select: false
   },
   passwordConfirm: String,
   passwordChanged: Date,
   resetToken: String,
   resetTokenCreated: Date,
   confirmToken: String,
   confirmTokenCreated: Date,
   emailChanged: Date,
   emailCandidate: {
      type: String,
      validate: {
         validator: val => validator.isEmail(val),
         message: 'Invalid email'
      }
   }
})


userSchema.methods.createResetToken = async function() {
   const resetHash = crypto.randomBytes(32).toString('hex')

   this.resetToken = crypto
      .createHash('sha256')
      .update(resetHash)
      .digest('hex')
   this.resetTokenCreated = new Date()

   await this.save({ validateBeforeSave: false })

   return resetHash
}

userSchema.methods.createConfirmHash = async function() {
   const confirmHash = crypto.randomBytes(32).toString('hex')

   this.confirmToken = crypto
      .createHash('sha256')
      .update(confirmHash)
      .digest('hex')
   this.confirmTokenCreated = new Date()

   await this.save({ validateBeforeSave: false })

   return confirmHash
}

userSchema.pre(/^save/i, async function (next) {
   // 1) Hash check if passwords are the same and hash them
   if (this.isModified('password') || this.isNew) {
      if (this.passwordConfirm !== this.password)
         next(new AppError('Password and password confirm are not the same', 400))

      this.passwordChanged = Date.now() - 1000
      this.password = await bcryptjs.hash(this.password, 12)

      this.passwordConfirm = undefined
   }

   if ( this.isNew || this.isModified('email'))
      this.emailChanged = Date.now() - 1000

   next()
})


module.exports = model('User', userSchema)