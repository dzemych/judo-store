const { Router } = require('express')
const dataController = require('../controllers/data.controller')
const handlerFactory = require('../controllers/handlerFactory')
const Data = require('../db/data.model')
const photoController = require("../controllers/photo.controller");


const router = Router()

// Client cannot delete any document, cause model HallBase responds for main site data,
// that cannot be deleted, but can be crated if there are no

router.get('/check/:id', dataController.checkExistence)

router.get('/', handlerFactory.getAll(Data))

router
   .route('/pagesData')
   .get(dataController.getPagesData)
   .patch(
      photoController.uploadPhotos,
      dataController.updatePagesData
   )

router.get('/pagesData/:page', dataController.getOnePageData)

router
   .route('/:id')
   .get(dataController.getOneData)
   .post(
      photoController.uploadOnePhoto,
      dataController.createData
   )
   .patch(
      photoController.uploadOnePhoto,
      dataController.updateData,
   )


module.exports = router