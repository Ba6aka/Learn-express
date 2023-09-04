const express = require('express')
const app = express()

const { getTime } = require('./controllers/tour-controller.js')
const { tourRouter } = require('./routes/tour-route.js')
const { userRouter } = require('./routes/user-route.js')

app.use(express.json())
app.use(getTime)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use(express.static(`${__dirname}/public`))
module.exports = { app }
