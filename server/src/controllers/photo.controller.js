const AppError = require('../utils/AppError')
const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const photoUtils = require('../utils/fileUtils')
const {checkAndCreateDir, resizeAndWritePhoto, deleteDir} = require("../utils/fileUtils");
const path = require("path");


const upload = multer({
   fileFilter: photoUtils.multerFilter,
   storage: multer.memoryStorage()
})


exports.uploadPhotos = upload.array('photos')

exports.uploadOnePhoto = upload.single('upload')

exports.atLeastOnePhotoCheck = catchAsync(async (req, res, next) => {
   if (!req.file)
      return next(new AppError('Please provide photo in req in upload filed in form data', 400))

   next()
})

exports.checkTeamPhoto = method => catchAsync(async (req, res, next) => {
   if (method === 'post')
      if (!req.files || req.files.length !== 1)
         return next(new AppError('One photo needed', 400))

   next()
})