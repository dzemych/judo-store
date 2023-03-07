const {Schema, model} = require("mongoose")
const contentPath = require('./content.path')
const slugify = require("slugify");
const {getAbsPath} = require("../utils/fileUtils");
const path = require("path");
const fs = require("fs");
const {
   checkAndCreateDir,
   resizeAndWritePhoto,
   checkDirExist,
} = require('../utils/fileUtils')


const productSchema = new Schema({
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
      get : getAbsPath,
      set: function(val) {
         const id = this._id

         // 1) Check or create dir for imgs
         const photoDirPath = `public/img/product/${id}`

         checkAndCreateDir(photoDirPath)

         // 2) Write main photo(600 width) and back photo (full width)
         const backPhotoName = `back-product-${id}.jpg`
         const mainPhotoName = `main-product-${id}.jpg`

         // 3) Get photos relative url
         const relTempPhotoPath = `public/${val.split('/').slice(-4).join('/')}`
         const absNewBackPath = path.resolve(photoDirPath, backPhotoName)

         // If invalid val return no image
         if (!checkDirExist(relTempPhotoPath)) {
            const noImgPath = 'public/img/no-image.png'

            this.backPhoto = noImgPath
            return noImgPath
         }

         // Resize and write to proper dir main photo and move back photo
         fs.renameSync(path.resolve(relTempPhotoPath), absNewBackPath)
         resizeAndWritePhoto(absNewBackPath, path.join(photoDirPath, mainPhotoName), 600)

         this.backPhoto = `${photoDirPath}/${backPhotoName}`
         return `${photoDirPath}/${mainPhotoName}`
      }
   },
   price: {
      required: true,
      type: Number
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
}, {
   toObject: { getters: true, setters: true },
   toJSON: { getters: true, setters: true },
   runSettersOnQuery: true,
})

productSchema.add(contentPath(false))


module.exports = model('product', productSchema)