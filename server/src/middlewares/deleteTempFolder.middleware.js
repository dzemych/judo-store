const {getPhotoSrcFromContent, deleteDir} = require("../utils/fileUtils");


const deleteTempFolder = function(req, res, next) {
   res.on('finish', function() {
      const code = res.statusCode
      const changeData = req.method.match(/(put|post|patch|delete)/i)

      if (!changeData && code < 300)
         next()

      const contype = req.headers['content-type']

      let data = req.body
      if (
         (!contype || contype.match(/multipart\/form-data/)) &&
         typeof req.body.data === 'string'
      )
         data = JSON.parse(req.body.data)

      // Check if req has at least one field that may contain temp photos
      // Look for temp photo files where we can get temp folder path
      const searchFields = ['photos', 'mainPhoto', 'content']
      const dataFields = Object.keys(data)

      const tempDir = searchFields.reduce((acc, key) => {
         if (acc) return acc

         if (
            dataFields.includes(key) &&
            data[key] &&
            Object.keys(data[key]).length
         ) {
            let srcArr

            if (key === 'content')
               srcArr = getPhotoSrcFromContent(data[key])

            if (key === 'photos')
               srcArr = data[key]

            if (key === 'mainPhoto')
               srcArr = [data[key]]

            const tempArr = srcArr.filter(el => el.match(/\/img\/temp\//))
            if (tempArr.length > 0)
               acc = tempArr[0]
         }

         return acc
      }, '')

      if (tempDir)
         deleteDir(tempDir)
   })

   next()
}

module.exports = deleteTempFolder