const fs = require('fs')
const express = require('express')

const port = 3000
const app = express()

// let tours = JSON.parse(fs.readFileSync(`dev-data/data/tours-simple.json`))

const data = {
  tours: JSON.parse(fs.readFileSync(`dev-data/data/tours.json`)),
  users: JSON.parse(fs.readFileSync(`dev-data/data/users.json`))
}


app.listen(port, () => {
  console.log(`server started on ${port} port`)
})

app.use(express.json())
app.use(getTime)

app.route('/api/v1/tours').get(getAll).post(addOne)
app.route('/api/v1/users').get(getAll).post(addOne)
app.route('/api/v1/tours/:id').get(getOne).patch(updateOne).delete(deleteTour)
app.route('/api/v1/users/:id').get(getOne).patch(updateOne).delete(deleteTour)


function getAll(req, res) {
  const url = req.url.split('/')[3]
  const UT = data[url]

  res.
    status(200)
    .json({
      success: 'success',
      time: req.requestTime,
      UT
    })
}

function addOne(req, res) {
  const url = req.url.split('/')[3]
  const UT = data[url]
  const id = UT[UT.length - 1].id + 1
  const newData = Object.assign({ id }, req.body)

  fs.writeFile(`./dev-data/data/${url}.json`, JSON.stringify([...tours, newTour]), err => {
    res.status(201).json({
      success: 'success',
      data: { newData }
    })
  })
}

function getOne(req, res) {
  const url = req.url.split('/')[3]
  const UT = data[url]
  const newData = UT.find(el => el._id == req.params.id)

  if (!newData) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.json({
    status: 'success',
    newData
  })
}

function updateOne(req, res) {
  const url = req.url.split('/')[3]
  const UT = data[url]

  if (+req.params._id > UT.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  for (const [param, value] of Object.entries(req.body)) {
    UT[+req.params.id][param] = value
  }

  const newData = UT[+req.params.id]

  fs.writeFile(`./dev-data/data/${url}.json`, JSON.stringify(UT), err => {
    res.status(200).json({
      status: 'success',
      newData
    })
  })
}

function deleteTour(req, res) {
  const url = req.url.split('/')[3]
  const UT = data[url]

  if (+req.params.id > UT.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  const deletedTour = UT[req.params.id];
  UT.splice(req.params.id, 1)

  fs.writeFile(`./dev-data/data/${url}.json`, JSON.stringify(UT), err => {
    res.json({
      status: 'success',
      deletedTour
    })
  })
}

function getTime(req, res, next) {
  req.requestTime = new Date().toISOString()
  next()
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', addTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)