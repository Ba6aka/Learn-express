const fs = require('fs')
const express = require('express')

const port = 3000
const app = express()
let tours = JSON.parse(fs.readFileSync(`dev-data/data/tours-simple.json`))


app.listen(port, () => {
  console.log(`server started on ${port} port`)
})

app.use(express.json())
app.use(getTime)

app.route('/api/v1/tours').get(getAllTours).post(addTour)
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)


function getAllTours(req, res) {
  res.
    status(200)
    .json({
      success: 'success',
      time: req.requestTime,
      data: { tours }
    })
}

function getTour(req, res) {
  const tour = tours.find(el => el.id === +req.params.id)

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.json({
    status: 'success',
    tour
  })
}

function addTour(req, res) {
  console.log(req.body)

  const id = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id }, req.body)

  fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify([...tours, newTour]), err => {
    res.status(201).json({
      success: 'success',
      data: { newTour }
    })
  })
}

function updateTour(req, res) {
  if (+req.params.id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  for (const [param, value] of Object.entries(req.body)) {
    tours[+req.params.id][param] = value
  }

  const newTour = tours[+req.params.id]

  fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
    res.status(200).json({
      status: 'success',
      newTour
    })
  })
}

function deleteTour(req, res) {
  if (+req.params.id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  const deletedTour = tours[req.params.id];
  tours.splice(req.params.id, 1)

  fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
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