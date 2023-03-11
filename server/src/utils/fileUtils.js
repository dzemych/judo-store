const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const AppError = require("./AppError");


const resizeAndWritePhoto = (photo, path, width, quality) => {
   sharp(photo)
      .resize({ width })
      .withMetadata()
      .flatten({
         background: {r: 255, g: 255, b: 255, alpha: 1}
      })
      .toFormat('jpeg')
      .jpeg({ quality: quality })
      .toFile(path)
}

const getUniqueId = () => {
   return `${Math.floor(Math.random() * 10000)}${Math.floor(Math.random() * 1000)}`
}
exports.getUniqueId = getUniqueId

const generateNewRelPhotoPath = (modelName, id) => {
   const photoName = `${id}-${getUniqueId()}${new Date().getTime()}.jpg`

   return `public/img/${modelName}/${id.toString()}/${photoName}`
}
exports.generateNewRelPhotoPath = generateNewRelPhotoPath

const getPhotoPath = (modelName, id, name) => {
   const uid = getUniqueId()

   return `public/img/${modelName}/${id}/${name}-${modelName}-${uid}.jpg`
}

const deleteDir = (dirPath) => {
   let dir

   if (dirPath instanceof Array)
      dir = dirPath.join('/')
   else dir = path.resolve(dirPath)

   if (/^(http|https)/.test(dirPath))
      dir = path.resolve(`public/${dirPath.split('/').slice(3, -1).join('/')}`)

   if (fs.existsSync(dir))
      fs.rmSync(dir, { recursive: true, force: true })
}

const checkDirExist = (dirPath) => {
   if (path.isAbsolute(dirPath))
      return fs.existsSync(dirPath)

   return fs.existsSync(path.resolve(dirPath))
}
exports.checkDirExist = checkDirExist

const getRelPhotoPath = (photoPath) => {
   const pathArr = photoPath.split('/')

   return ['public', 'img', ...pathArr.slice(-3)].join('/')
}
exports.getRelPhotoPath = getRelPhotoPath

const checkAndCreateDir = (dirPath) => {
   // All directions are inside assets folder
   let dirArr = ['public', 'img', ...dirPath.split('/').slice(-2)]

   // Dir from top to bottom and create if it doesn't exist
   dirArr.forEach((el, i) => {
      const checkPath = path.resolve( dirArr.slice(0, i + 1).join('/') )

      if (!fs.existsSync(checkPath))
         fs.mkdirSync(checkPath)
   })
}

const renamePhotoAndGetPath = (newRelPath, oldRelPath) => {
   let oldAbsPath = path.resolve('public', oldRelPath)

   if (oldRelPath.split('/')[0] === 'public')
      oldAbsPath = path.resolve(oldRelPath)

   try {
      fs.renameSync(oldAbsPath, path.resolve(newRelPath))
   } catch (e) {
      throw new AppError(`Error during renaming photos: ${e.message}`, 500)
   }

   return newRelPath
}

const writeAndGetNewPhotos = (relativePaths, id, modelName) => {
   const photos = []

   // 1) Write and resize all photos to proper folder
   for (i in relativePaths) {
      const newPath = generateNewRelPhotoPath(modelName, id)
      renamePhotoAndGetPath(newPath, relativePaths[i].join('/'))

      photos.push(newPath)
   }

   return photos
}

const getUrlFromPath = (dir) => {
   const relDir = dir.split('/').slice(1).join('/')
   return `${curProtocol}://${curHost}/${relDir}`
}

exports.deleteDir = deleteDir

exports.resizeAndWritePhoto = resizeAndWritePhoto

exports.checkAndCreateDir = checkAndCreateDir

exports.getPhotoPath = getPhotoPath

exports.renamePhotoAndGetPath = renamePhotoAndGetPath

exports.updateMainPhotoAndBack = async (photo, modelName, item, next) => {
   const id = item._id

   // 2) Create dir for main and back imgs
   const dirPath = `public/img/${modelName}/${id}`
   try {
      await checkAndCreateDir(dirPath)
   } catch (e) {
      await item.remove()
      throw next(new AppError(`Error during dir check: ${e.message}`, 500))
   }

   // 3) Write main photo(450px width) and back photo (full width)
   const backPhotoName = `back-${modelName}-${id}.jpg`
   const mainPhotoName = `main-${modelName}-${id}.jpg`

   // Process photo if it is provided as File
   if (Buffer.isBuffer(photo)) {
      try {
         await resizeAndWritePhoto(photo, path.join(dirPath, backPhotoName))
         await resizeAndWritePhoto(photo, path.join(dirPath, mainPhotoName), 600)
      } catch(e) {
         deleteDir(`public/img/${modelName}/${id}`)
         await item.remove()

         throw next(new AppError(`Error during main photo writing: ${e.message}`, 500))
      }
   }

   // Process photo if it is provided as temp photo dir
   if (typeof photo === 'string') {
      const relPhotoPath = `public/${photo.split('/').slice(-4).join('/')}`
      const newBackPath = path.resolve(dirPath, backPhotoName)

      if (item.mainPhoto === relPhotoPath)
         return

      try {
         // Move back photo to proper dir
         fs.renameSync(path.resolve(relPhotoPath), newBackPath)
         // Resize and write to proper dir main photo
         await resizeAndWritePhoto(newBackPath, path.join(dirPath, mainPhotoName), 600)
      } catch(e) {
         throw next(new AppError(`Error during processing photo as url to temp file: ${e.message}`, 500))
      }
   } else {
      throw next(new AppError('Unknown photo format', 406))
   }

   item.mainPhoto = `${dirPath}/${mainPhotoName}`
   item.backPhoto = `${dirPath}/${backPhotoName}`

   await item.save({ new: true })
}

exports.getAbsPath = getUrlFromPath

exports.multerFilter = (req, file, cb) => {
   const fileExt = file.mimetype.split('/')[0]

   if (fileExt !== 'image')
      return cb(new AppError('Upload only images', 415), false)

   cb(null, true)
}

exports.getTempPhotoAndChangeContent = function (content, srcArr, modelName) {
   if (srcArr.length < 1) {
      return content
   } else {
      let newValue = content

      // 1) Get relative paths and photo names
      const relativePaths = srcArr.map(el => el.split('/').slice(-4))

      // 2) Write photos to proper dirs
      checkAndCreateDir(`public/img/${modelName}/${this._id}`)

      const photos = writeAndGetNewPhotos(relativePaths, this._id.toString(), modelName)

      // 3) Change content srcs with relative paths
      srcArr.forEach((el, i) => {
         newValue = newValue.replace(el, photos[i])
      })

      return { newPhotos: photos, newValue }
   }
}

exports.processAndGetNewPhotos = (photos, item, modelName) => {
   // 1) Get relative paths for photos arr
   const photosCandidate = photos.map(el =>
      ['public', ...el.split('/').slice(-4)].join('/')
   )

   // 2) Get new photos arr and move newly added photos to proper dir
   let tempRelDir
   const newPhotos = photosCandidate.map((el, idx) => {
      const isOld = item.photos.includes(getUrlFromPath(el))

      // If it's old photo (order) of old path hasn't changed return it
      if (isOld && getPhotoPath(modelName, item._id, idx) === el)
         return el

      // Save temp dir path to delete it later
      if (!tempRelDir && !isOld) tempRelDir = el

      // If order has changed, or it's new rename photo and get its path
      return renamePhotoAndGetPath(modelName, item._id, idx, el)
   })

   // 3) Delete old photos that is not in new photos arr
   try {
      const relDirPath = `public/img/${modelName}/${item._id}`
      const files = fs.readdirSync(path.resolve(relDirPath))

      files.forEach(el => {
         const photoPath = `${relDirPath}/${el}`

         if (
            !(newPhotos.includes(photoPath)) &&
            el.split('-')[0] !== 'back' &&
            el.split('-')[0] !== 'main'
         )
            deleteDir(photoPath)
      })
   }
   catch (e) {
      throw new AppError(`Error during deleting old photos: ${e.message}`, 500)
   }

   return newPhotos
}

exports.processPhotos = (srcArr, item, type, modelName) => {
   // 1) Get relative paths and photo names
   const relativePaths = srcArr.map(el => el.split('/').slice(-4))

   // 2) Write photos to proper dirs
   if (type !== 'update')
      checkAndCreateDir(`public/img/${modelName}/${item._id}`)

   // 3) Write and get photos
   return writeAndGetNewPhotos(relativePaths, item._id.toString(), modelName)
}

exports.getPhotoSrcFromContent = (content) => {
   const srcRegex = /(http|https):\/\/.{3,80}\/img\/.*\.(jpg|jpeg|png|gif)/gi

   // 1) Get array of img srcs
   const elArr = content.replace(/([<>])/g, "|").split("|")
   const srcArr = elArr.reduce((acc, el) => {
      const str = el.match(srcRegex)

      if (str)
         acc.push(str[0])

      return acc
   }, [])

   return srcArr
}

exports.getRelPathFromUrl = (url, addPublic = true) => {
   return `${addPublic ? 'public' : ''}${url.split('/').slice(-4).join('/')}`
}

exports.updatePhotosList = (photos = [], item, modelName) => {
   // 0) If no photos return
   if (!photos.length && !item.photos?.length)
      return undefined

   // 1) Get relative paths for photos arr
   const newRelPhotosArr = photos.map(el =>
      el.split('/').slice(-3).join('/')
   )

   // 2) Get new photos arr and move newly added photos to proper dir
   const newPhotos = newRelPhotosArr.map((el) => {
      const relPhotoPath = getRelPhotoPath(el)
      const absPhotoPath = path.resolve(relPhotoPath)
      const isOld = item.photos.includes(relPhotoPath)

      if (isOld)
         return relPhotoPath

      const newPhotoPath = generateNewRelPhotoPath('product', item._id)
      resizeAndWritePhoto(absPhotoPath, newPhotoPath, undefined, 90)

      return newPhotoPath
   })


   // 3) Delete old photos that is not in new photos arr
   try {
      const relDirPath = `public/img/${modelName}/${item._id}`
      const files = fs.readdirSync(path.resolve(relDirPath))

      files.forEach(el => {
         const photoPath = `${relDirPath}/${el}`

         if (
            !newPhotos.includes(photoPath) &&
            el.split('-')[0] !== 'back' &&
            el.split('-')[0] !== 'main'
         )
            deleteDir(photoPath)
      })
   }
   catch (e) {
      throw new AppError(`Error during deleting old photos: ${e.message}`, 500)
   }

   return newPhotos
}