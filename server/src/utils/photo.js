const path = require('path')
const {getPhotoPath} = require("./fileUtils");


class Photo {
   constructor (path) {
      this.path = path.split('/').slice(-3).join('/')

      if (path.math(/img\/temp/i)) {
         const newPath = getPhotoPath()
      }
   }

   get relPath() {
      return `public/img/${this.path}`
   }

   get getAbsPath() {
      return path.resolve(`public/img/${this.path}`)
   }
}

module.exports = Photo