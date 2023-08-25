const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`dev-data/data/tours.json`))

function getAll(req, res) {

  res.
    status(200)
    .json({
      success: 'success',
      time: req.requestTime,
      tours
    })
}

function addOne(req, res) {
  const _id = tours[tours.length - 1]._id + 1
  const newTour = Object.assign({ _id }, req.body)

  fs.writeFile(`dev-data/data/tour.json`, JSON.stringify([...tours, newTour]), err => {
    res.status(201).json({
      success: 'success',
      data: { newData: newTour }
    })
  })
}

function getOne(req, res) {
  const newData = tours.find(el => el._id == req.params.id)

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

  if (+req.params._id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  for (const [param, value] of Object.entries(req.body)) {
    tours[+req.params.id][param] = value
  }

  const newData = tours[+req.params.id]

  fs.writeFile(`../dev-data/data/tour.json`, JSON.stringify(tours), err => {
    res.status(200).json({
      status: 'success',
      newData
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

  fs.writeFile(`../dev-data/data/tour.json`, JSON.stringify(tours), err => {
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

function checkBody(req, res, next) {
  if (Object.keys(req.body).every(key => Object.keys(tours[0]).includes(key))) {
    next()
  }

  else {
    return res.status(400).json({
      status: 'fail',
      descr: 'Invalid params'
    }
    )
  }
}

module.exports = { getAll, addOne, getOne, updateOne, deleteTour, getTime, checkBody }