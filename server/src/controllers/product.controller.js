const ObjectId = require('mongoose').Types.ObjectId
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Product = require('../db/product.model')
const {
   getAbsPath,
   deleteDir,
   renamePhotoAndGetPath,
   generateNewRelPhotoPath,
   updatePhotosList,
} = require("../utils/fileUtils");



exports.createOneProduct = catchAsync(async (req, res, next) => {
   if (!Object.keys(req.body).length)
      return next(new AppError('Put all necessary fields in data field', 400))

   // 1) Parse data from json and create new item
   const data = req.body
   if (!data.mainPhoto)
      return next(new AppError('Provide main photo or in upload field as file or in data.mainPhoto', 400))

   const item = await Product.create(data)

   if (data.photos && data.photos.length > 0) {
      const tempRelPaths = item.photos.map(el => el.split('/').slice(-4))
      const newPhotosList = []

      // Write and resize all photos to proper folder
      for (i in tempRelPaths) {
         const newPhotoPath = generateNewRelPhotoPath('product', item._id)
         const newPath = renamePhotoAndGetPath(newPhotoPath, tempRelPaths[i].join('/'))

         newPhotosList.push(newPath)
      }

      item.photos = newPhotosList
   }

   await item.save({ new: true })

   res.status(201).json({
      ok: true,
      statusText: 'OK',
      message: `Product successfully created`,
      item: { _id: item._id, slug: item.slug }
   })
})

exports.getOne = catchAsync(async (req, res, next) => {
   const id = req.params.slug
   // ObjectId.isValid not working correctly with certain slugs
   const isId = ObjectId.isValid(id) && id.split('-').length < 2

   console.log(id, isId)
   const item = await Product.findOne(isId ? { _id: id } : { slug: id })

   if (!item)
      return next(new AppError('No item found with that id', 404))

   if (item.photos)
      item.photos = item.photos.map(getAbsPath)

   res.json({
      ok: true,
      status: 'success',
      message: `Product found`,
      item
   })
})

exports.deleteOne = catchAsync(async (req, res, next) => {
   await Product.findByIdAndRemove(req.params.slug)

   deleteDir([
      'public/img',
      'product'.toLowerCase(),
      req.params.slug
   ].join('/'))

   res.status(204).json()
})

exports.updateOne = catchAsync(async (req, res, next) => {
   const id = req.params.slug
   // ObjectId.isValid not working correctly with certain slugs
   const isId = ObjectId.isValid(id) && id.split('-').length < 2

   // 1) Update document in database
   const data = req.body
   const item = await Product.findOne(isId ? { _id: id } : { slug: id })

   Object.keys(data).forEach(key => {
      if (key !== 'photos')
         item[key] = data[key]
   })

   item.photos = updatePhotosList(data.photos, item, 'product')

   await item.save({ new: true })

   res.status(200).json({
      ok: true,
      statusText: 'OK',
      message: `Product was successfully updated.`,
      item
   })
})