const {Schema} = require('mongoose')
const util = require("util");
const slugify = require('slugify')
const {
   getAbsPath,
} = require("../utils/fileUtils");
const contentPath = require('./content.path')


function BaseArticleSchema() {
   Schema.apply(this, arguments)

   // 1) Add schema paths
   this.add({
      title      : {
         type    : String,
         required: true,
         unique  : true,
         set: function (val) {
            this.slug = slugify(val, {lower: true})

            return val
         }
      },
      slug       : {
         type   : String,
         unique: true,
         default: function () {
            return slugify(this.title, {lower: true})
         }
      },
      backPhoto  : {
         type: String,
         get : getAbsPath
      },
      mainPhoto  : {
         type: String,
         get : getAbsPath
      },
      beforeTitle: String,
      afterTitle : String,
      text       : String,
      date       : {
         type: Date,
         set: function(val) {
            return val === 0 ? undefined : val
         }
      },
      createdAt  : {
         type: Date,
         default: function() {
            return new Date()
         }
      },
      photos: [String]
   })
   // Add content path (also photos arr for content)
   this.add(contentPath(true))

   // 2) Set schema options
   this.set('toObject', {getters: true})
   // For some reason1 getters on json won't work any way (json I mean when you use .lean())
   this.set('toJSON', {getters: true})
}

util.inherits(BaseArticleSchema, Schema)

module.exports = BaseArticleSchema