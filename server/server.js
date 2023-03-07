const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')
const expressApp = require('./src/app')
const next = require('next')


dotenv.config({path: path.resolve('config.env')})

// TODO get db user from config
// Export cur host domain, cause for some reason I cannot access it from model file
const PORT = process.env.PORT
const dev = process.env.NODE_ENV !== 'production'
const client = process.env.TYPE !== 'back'

const dbLocalUrl = process.env.DB_LOCAL_URL
const dbPassword = process.env.DB_PASSWORD
const dbUser = process.env.DB_USER

let db = dbLocalUrl.replace('<password>', dbPassword)
db = db.replace('<user>', dbUser)

const nextApp = next({ dev, port: PORT, dir: '../' })
const handler = nextApp.getRequestHandler()

if (client) {
   nextApp.prepare()
      .then(async () => {
         await mongoose.connect(db)
         console.log('DB connection successful')

         expressApp.get('*', (req, res) => {
            return handler(req, res)
         })

         expressApp.listen(PORT, (err) => {
            if (err) throw err
            console.log(`Server running on port ${PORT}`)
         })
      })
      .catch((ex) => {
         console.error(ex.stack)
         process.exit(1)
      })
} else {
   const start = async () => {
      try {
         await mongoose.connect(db)
         console.log('DB connection successful')

         expressApp.listen(PORT, (err) => {
            if (err) throw err
            console.log(`Server running on port ${PORT}`)
         })
      } catch (e) {
         console.log(e)
         process.exit(1)
      }
   }

   start()
}

