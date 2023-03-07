const sendDevError = (err, res) => {
   res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      isOperational: err.isOperational,
      stack: err.stack
   })
}

const sendProdError = (err, res) => {
   if (err.isOperational) {
      res.status(err.statusCode).json({
         ok: false,
         message: err.message
      })
   } else {
      // 1) Log error
      console.log('Error ///////////////')
      console.log(err)

      // 2) Send generic message
      res.status(500).json({
         ok: false,
         message: 'Something went wrong...'
      })
   }
}

const errorController = (err, req, res, next) => {
   err.statusCode = err.statusCode || 500
   err.message = err.message || 'Something went wrong...'
   err.isOperational = err.isOperational || false

   if (process.env.NODE_ENV === 'production') {
      sendProdError(err, res)
   } else {
      sendDevError(err, res)
   }
}

module.exports = errorController