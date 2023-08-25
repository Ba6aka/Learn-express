const express = require('express')
const { getAll, addOne, getOne, updateOne, deleteTour, checkBody } = require('../controllers/tour-controller.js')
const tourRouter = express.Router('/api/v1/tours')

tourRouter
  .route('/')
  .get(getAll)
  .post(checkBody, addOne)

tourRouter.route('/:id')
  .get(getOne)
  .patch(updateOne)
  .delete(deleteTour)

module.exports = { tourRouter }