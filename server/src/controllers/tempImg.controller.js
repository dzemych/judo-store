const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const multer = require("multer");
const path = require('path')
const {
   checkAndCreateDir,
   resizeAndWritePhoto,
   multerFilter,
   deleteDir,
   getUniqueId
} = require("../utils/fileUtils");


const upload = multer({
   fileFilter: multerFilter,
   storage: multer.memoryStorage()
})

exports.uploadMulter = upload.single('upload')

exports.uploadTempImg = catchAsync(async (req, res, next) => {
   const folderPath = `${req.params.collection}-${req.params.folderId}`
   const fileName = `${folderPath}-${getUniqueId()}.jpg`
   const dirPath = `public/img/temp/${folderPath}`

   try {
      await checkAndCreateDir(dirPath)
   } catch (e) {
      return next(new AppError(`Error during directory check: ${e.message}`, 400))
   }

   try {
      await resizeAndWritePhoto( req.file.buffer, path.join(dirPath, fileName) )
   } catch (e) {
      return next(new AppError(`Error during file writing: ${e.message}`, 400))
   }

   res.json({
      ok: true,
      message: 'File has been temporary uploaded to server',
      url: `${curProtocol}://${curHost}/img/temp/${folderPath}/${fileName}`
   })
})

exports.deleteCollection = catchAsync(async (req, res, next) => {
   deleteDir([
      'assets/img/temp',
      `${req.params.collection}`
   ].join('/'))

   res.status(204).json()
})

exports.deleteFolder = catchAsync(async (req, res, next) => {
   deleteDir([
      'assets/img/temp',
      `${req.params.collection}-${req.params.folderId}`
   ].join('/'))

   res.status(204).json()
})

exports.deleteTempImg = catchAsync(async (req, res, next) => {
   deleteDir(
      [
         'assets/img/temp',
         `${req.params.collection}-${req.params.timeStamp}`,
         `${req.params.imgId}`,
      ].join('/')
   )

   res.status(204).json()
})

exports.notFound = catchAsync(async (req, res, next) => {
   res.status(404).json({
      ok: false,
      message: 'To temporary upload photos use this endpoint: img/temp/[collectionName][uid]'
   })
})