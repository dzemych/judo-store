const {model, Schema} = require('mongoose')
const contentPath = require('./content.path')


const dataSchema = new Schema({
   _id: {
      type: String,
      required: true
   },
   ...[Schema.Types.Mixed]
}, {
   id: false,
   strict: false,
   toJSON: { getters: true },
   toObject: { getters: true }
})

dataSchema.add(contentPath(false))

module.exports = model('Data', dataSchema)