const { Router } = require('express')
const tempImgController = require('../controllers/tempImg.controller')


const router = Router()

router.post(
   '/temp/:collection/:folderId',
   tempImgController.uploadMulter,
   tempImgController.uploadTempImg
)

router.delete(
   '/temp/:collection/:folderId',
   tempImgController.deleteFolder
)

router.delete(
   '/temp/:collection/:timeStamp/:imgId',
   tempImgController.deleteTempImg
)

router.route('/temp/*', tempImgController.notFound)

module.exports = router