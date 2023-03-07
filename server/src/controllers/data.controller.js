const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Data = require('../db/data.model')
const {
   processPhotos,
   getAbsPath,
   checkAndCreateDir,
   renamePhotoAndGetPath,
   deleteDir, updatePhotosList, generateNewRelPhotoPath
      } = require("../utils/fileUtils")
const fs = require("fs");
const path = require("path");


exports.checkExistence = catchAsync(async (req, res, next) => {
   const item = await Data.exists({ _id: req.params.id })

   if (!item)
      res.json({
         ok: true,
         status: 'success',
         exist: false,
         message: 'Item do not exists'
      })
   else
      res.json({
         ok: true,
         status: 'success',
         exist: true,
         message: 'Item found'
      })
})

exports.getOneData = catchAsync(async (req, res, next) => {
   if (!req.params.id)
      return next(new AppError('Please provide id in url as the last path', 400))

   const item = await Data.findById(req.params.id)
   if (!item)
      return next(new AppError('Data with such id not found', 404))

   if (!item.content && item.photos)
      item.photos = item.photos.map(getAbsPath)

   res.json({
      ok: true,
      status: 'success',
      message: 'Data was found',
      item
   })
})

exports.createData = catchAsync(async (req, res, next) => {
   if (!req.body)
      return next(new AppError('No data to create from', 400))

   const data = JSON.parse(req.body.data)
   const item = await Data.create({ _id: req.params.id, ...data, content: undefined })

   if (data.content)
      item.content = data.content
   await item.save({ new: true })

   try {
      if (!item.content && !data.content && data.photos)
         item.photos = processPhotos(data.photos, item, 'create', 'data')

      await item.save({ new: true })
   } catch (e) {
      await item.remove()
      throw e
   }

   res.status(201).json({
      ok: true,
      statusText: 'OK',
      message: `Data successfully created`,
      item
   })
})

exports.getOnePageData = catchAsync(async (req, res, next) => {
   const page = req.params.page
   if (!page)
      return next(new AppError('Provide page name', 400))

   const data = await Data.findById('pagesData').lean()

   const item = {
      title: '',
      backSrc: ''
   }

   if (data && data[page] && data[page].title)
      item.title = data[page].title

   if (data && data[page] && data[page].photo)
      item.backSrc = getAbsPath(data[page].photo)

   res.json({
      ok: true,
      message: 'Page data successfully received',
      item
   })
})

exports.getPagesData = catchAsync(async (req, res, next) => {
   const item = await Data.findById('pagesData').lean()
   if (!item)
      return next(new AppError('No pages data created yet', 404))

   for (key in item) {
      if (
         key !== '__v' &&
         key !== '_id' &&
         item[key].photo
      )
         item[key].photo = getAbsPath(item[key].photo)
   }

   res.json({
      ok: true,
      status: 'success',
      message: 'Data was found',
      item
   })
})

exports.updateData = catchAsync(async (req, res, next) => {
   const data = req.body.data ? JSON.parse(req.body.data) : ''
   const setData = {...data}
   delete setData.content
   delete setData.mainPhoto

   // Normal save doesn't work on paths that are not in schema
   const item = await Data.findByIdAndUpdate(req.params.id).set(setData)
   if (!item)
      return next(new AppError('Data with such id not found', 404))

   // 1) Update content
   if (data.content) {
      item.content = data.content
      await item.save({ new: true })
   }

   if (data.photos)
      item.photos = updatePhotosList(data.photos, item, 'data')

   await item.save({ new: true })

   res.status(200).json({
      ok: true,
      statusText: 'OK',
      message: `Data was successfully updated.`,
      item: item
   })
})

exports.updatePagesData = catchAsync(async (req, res, next) => {
   const photosRelDir = 'public/img/data/pagesData'
   const data = JSON.parse(req.body.data)

   // * Check for necessary data
   if (!req.body.data)
      return next(new AppError('No data to update', 400))

   // * Create dir for page photos
   checkAndCreateDir(photosRelDir)

   // 1) Move photos from temp dir to proper
   const newPhotos = Object.keys(data).reduce((acc, key) => {
      const absPhotoPath = data[key].photo
      if (!absPhotoPath) return acc

      const relPhotoPath = ['public', ...absPhotoPath.split('/').slice(-4)].join('/')
      let finalPhotoPath

      if (relPhotoPath.includes('temp'))
         finalPhotoPath = renamePhotoAndGetPath(
            generateNewRelPhotoPath('data', 'pagesData'),
            relPhotoPath
         )
      else
         finalPhotoPath = relPhotoPath

      data[key].photo = finalPhotoPath
      acc.push(finalPhotoPath)

      return acc
   }, [])

   // 3) Delete old photos
   try {
      const files = fs.readdirSync(path.resolve(photosRelDir))

      files.forEach(el => {
         const photoPath = `${photosRelDir}/${el}`

         if ( !(newPhotos.includes(photoPath)) )
            deleteDir(photoPath)
      })
   }
   catch (e) {
      throw new AppError(`Error during deleting old photos: ${e.message}`, 500)
   }

   // * Check if pages document already created
   let item = await Data.findById('pagesData').lean().count()

   // 4) Update db with data obj
   if (!item)
      item = await Data.create({ _id: 'pagesData', ...data })
   else
      await Data.findByIdAndUpdate('pagesData').set(data)

   res.json({
      ok: true,
      status: 'success',
      message: 'Back photos updated successfully',
      item
   })
})