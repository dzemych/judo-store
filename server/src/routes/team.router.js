const {Router} = require('express')
const handlerFactory = require('../controllers/handlerFactory')
const teamController = require('../controllers/team.controller')
const Team = require('../db/models/team.model')
const photoController = require('../controllers/photo.controller')


const router = Router()

router.get('/check/:slug', handlerFactory.checkUniqueSlug(Team))

router
   .route('/')
   .post(
      photoController.uploadOnePhoto,
      handlerFactory.createOneWithFormData(Team)
   )
   .get(teamController.getTeam)

router
   .route('/:id')
   .get(handlerFactory.getOne(Team))
   .patch(
      handlerFactory.checkExistence(Team),
      photoController.uploadOnePhoto,
      handlerFactory.updateOneWithFormData(Team)
   )
   .delete(handlerFactory.deleteOne(Team))


module.exports = router