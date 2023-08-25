const express = require('express')
const { getAll, addOne, getOne, updateOne, deleteTour } = require('../controllers/user-controller.js')
const userRouter = express.Router("/api/v1/users")

userRouter
  .route('/')
  .get(getAll)
  .post(addOne)

userRouter.route('/:id')
  .get(getOne)
  .patch(updateOne)
  .delete(deleteTour)

module.exports = { userRouter }