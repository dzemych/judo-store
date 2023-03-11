const express = require('express')
const path = require('path')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const cors = require('cors')
const app = express()
const errorController = require('./controllers/error.controller')
const apiRoutes = require('./api.routes.js')
const deleteTempFolder = require('./middlewares/deleteTempFolder.middleware')
const cookieParser = require('cookie-parser')
const adminRoutes = require('./admin.routes')


// 1) SECURITY middlewares
app.use(helmet({
   crossOriginResourcePolicy: false,
   contentSecurityPolicy    : {
      directives: {
         "script-src"               : ["'self'", "'unsafe-eval'"],
         "default-src"              : ["'self'"],
         "base-uri"                 : ["'self'"],
         "font-src"                 : ["'self'", "https:", "data:"],
         "form-action"              : ["'self'"],
         "frame-ancestors"          : ["'self'"],
         "img-src"                  : ["'self'", "data:", "http://localhost"],
         "object-src"               : ["'none'"],
         "script-src-attr"          : ["'none'"],
         "style-src"                : ["'self'", "https:", "'unsafe-inline'"],
         "upgrade-insecure-requests": '',
      }
   }
}))
app.use(mongoSanitize())
app.use(xssClean())

app.use(rateLimiter({
   max     : 500,
   windowMs: 60 * 500,
   message : 'To many requests from this IP'
}))

// * Cors
app.use(cors())

// 2) PARSING middlewares
app.use(express.json())
app.use(cookieParser())

// Set protocol and host to global variables
app.use((req, res, next) => {
   curHost = req.get('host')
   curProtocol = req.protocol

   next()
})

// 3) Routes
// After every post and patch request delete temp folder if there is such. Look for temp files
// in fields: content, photos, mainPhoto
app.use(deleteTempFolder)

app.use('/api', apiRoutes)
app.use('/admin', adminRoutes)

app.use('/img', express.static(path.resolve('public/img')))
app.use('/icons/favicon.png', express.static(path.resolve('public/icons/favicon.png')))
app.use((req, res, next) => {
   if (req.url === '/icons/favicon.png')
      console.log('/////////////')

   next()
})
app.use('/icons/favicon16x16.png', express.static(path.resolve('public/icons/favicon16x16.png')))
app.use('/icons/favicon32x32.png', express.static(path.resolve('public/icons/favicon32x32.png')))
app.use('/icons/favicon180x180.png', express.static(path.resolve('public/icons/favicon180x180.png')))

app.use('/admin', express.static(path.resolve('public/admin')))
app.use('/admin/**', express.static(path.resolve('public/admin')))

app.use(errorController)

module.exports = app