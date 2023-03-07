const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const APIfeatures = require('../utils/APIfeatures')
const {
   deleteDir,
   updateMainPhotoAndBack, renamePhotoAndGetPath, getAbsPath, getPhotoPath
      } = require('../utils/fileUtils')
const fs = require("fs")
const path = require("path")
const ObjectId = require('mongoose').Types.ObjectId


const updatePhotosList = (photos = [], item, modelName) => {
   // 1) Get relative paths for photos arr
   if (!photos.length && !item.photosList?.length)
      return undefined

   const photosCandidate = photos.map(el =>
      ['public', ...el.split('/').slice(-4)].join('/')
   )

   // 2) Get new photos arr and move newly added photos to proper dir
   let tempRelDir
   const newPhotos = photosCandidate.map((el, idx) => {
      const isOld = item.photos.includes(getAbsPath(el))

      // If it's old photo (order) of old path hasn't changed return it
      if (isOld && getPhotoPath(modelName, item._id, `photosList_${idx}`) === el)
         return el

      // Save temp dir path to delete it later
      if (!tempRelDir && !isOld) tempRelDir = el

      // If order has changed, or it's new rename photo and get its path
      return renamePhotoAndGetPath(modelName, item._id, `photosList_${idx}`, el)
   })

   // 3) Delete old photos that is not in new photos arr
   try {
      const relDirPath = `public/img/${modelName}/${item._id}`
      const files = fs.readdirSync(path.resolve(relDirPath))

      files.forEach(el => {
         const photoPath = `${relDirPath}/${el}`

         if (
            !(item.photos.includes(photoPath) || newPhotos.includes(photoPath)) &&
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

exports.checkUniqueSlug = collection => catchAsync(async (req, res, next) => {
   const is = await collection.findOne({ slug: req.params.slug }).select('_id').lean().count()
   if (is)
      return next(new AppError('This slug is not unique', 422))

   res.json({
      ok: true,
      message: 'This slug is unique',
      slug: req.params.slug
   })
})

exports.checkExistence = collection => catchAsync(async (req, res, next) => {
   const id = req.params.id
   // ObjectId.isValid not working correctly with certain slugs
   const isId = ObjectId.isValid(id) && id.split('-').length < 2

   const itemExists = await collection
      .findOne(isId ? { _id: id } : { slug: id })
      .select('_id')
      .lean()
      .count()

   if (!itemExists)
      return next(new AppError('No item exists with such id', 404))

   next()
})

exports.createOne = collection => catchAsync(async (req, res, next) => {
   const item = await collection.create(req.body)

   res.status(201).json({
      ok: true,
      status: 'success',
      message: 'Item successfully created.',
      item: item
   })
})

exports.getAll = (collection, optQuery = {}) => catchAsync(async (req, res) => {

   const features = new APIfeatures(collection, {
      ...req.query, ...optQuery
   })

   features
      .filter()
      .sort()
      .select()
      .paginate()

   // 3) Get queried data
   const data = await features.query
   const collectionLength = await collection.count()

   res.json({
      ok: true,
      status: 'success',
      message: 'Data successfully received',
      results: data.length,
      colLength: collectionLength,
      items: data
   })
})

exports.deleteOne = collection => catchAsync(async (req, res) => {
   const deletedItem = await collection.findByIdAndRemove(req.params.id)
   const modelName = deletedItem.constructor.modelName

   deleteDir([
      'public/img',
      modelName.toLowerCase(),
      req.params.id
   ].join('/'))

   res.status(204).json()
})

exports.createOneWithFormData = collection => catchAsync(async (req, res, next) => {
   if (!req.body.data)
      return next(new AppError('Put all necessary fields in data field', 400))

   // 1) Parse data from json and create new item
   const data = JSON.parse(req.body.data)
   if (!data.mainPhoto && !req.file)
      return next(new AppError('Provide main photo or in upload field as file or in data.mainPhoto', 400))

   const item = await collection.create(data)
   const modelName = item.constructor.modelName.toLowerCase()

   // 2) Write proper main and back photo paths main photo is provided as file
   if (req.file || data.mainPhoto) {
      await updateMainPhotoAndBack(
         data.mainPhoto || req.file.buffer,
         modelName,
         item,
         next
      )
   }

   // If there is photos list update it
   if (data.photosList && data.photosList.length > 0) {
      const tempRelPaths = data.photosList.map(el => el.split('/').slice(-4))
      const newPhotosList = []

      // Write and resize all photos to proper folder
      for (i in tempRelPaths) {
         const newPath = renamePhotoAndGetPath(
            modelName,
            item._id,
            `photosList_${i}`,
            tempRelPaths[i].join('/')
         )

         newPhotosList.push(newPath)
      }

      item.photosList = newPhotosList
   }

   await item.save({ new: true })

   res.status(201).json({
      ok: true,
      statusText: 'OK',
      message: `${modelName} successfully created`,
      item: { _id: item._id, slug: item.slug }
   })
})

exports.updateOneWithFormData = collection => catchAsync(async (req, res, next) => {
   const id = req.params.id
   // ObjectId.isValid not working correctly with certain slugs
   const isId = ObjectId.isValid(id) && id.split('-').length < 2

   // 1) Update document in database
   const data = req.body.data ? JSON.parse(req.body.data) : ''
   const item = await collection.findOne(isId ? { _id: id } : { slug: id })
   const modelName = item.constructor.modelName.toLowerCase()

   Object.keys(data).forEach(key => {
      item[key] = data[key]
   })

   await item.save({ new: true })

   // 2) Update main photo
   if (req.file || data.mainPhoto) {
      await updateMainPhotoAndBack(
         data.mainPhoto || req.file.buffer,
         modelName,
         item,
         next
      )
   }

   // 3) Update photos list
   item.photosList = updatePhotosList(data.photosList, item, modelName)

   await item.save({ new: true })

   res.status(200).json({
      ok: true,
      statusText: 'OK',
      message: `${modelName} was successfully updated.`,
      item
   })
})

exports.getOne = collection => catchAsync(async (req, res, next) => {
   const id = req.params.slug
   // ObjectId.isValid not working correctly with certain slugs
   const isId = ObjectId.isValid(id) && id.split('-').length < 2

   const item = await collection.findOne(isId ? { _id: id } : { slug: id })

   if (!item)
      return next(new AppError('No item found with that id', 404))

   const modelName = item.constructor.modelName.toLowerCase()

   if (item.photos)
      item.photos = item.photos.map(getAbsPath)

   res.json({
      ok: true,
      status: 'success',
      message: `${modelName} found`,
      item
   })
})