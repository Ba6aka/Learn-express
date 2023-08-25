const fs = require('fs')
const users = JSON.parse(fs.readFileSync(`dev-data/data/users.json`))

function getAll(req, res) {
  res.
    status(200)
    .json({
      success: 'success',
      time: req.requestTime,
      users
    })
}

function addOne(req, res) {
  const id = users[users.length - 1].id + 1
  const newData = Object.assign({ id }, req.body)

  fs.writeFile(`dev-data/data/tour.json`, JSON.stringify([...users, newTour]), err => {
    res.status(201).json({
      success: 'success',
      data: { newData }
    })
  })
}

function getOne(req, res) {
  const newData = users.find(el => el._id == req.params.id)

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

  if (+req.params._id > users.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  for (const [param, value] of Object.entries(req.body)) {
    users[+req.params.id][param] = value
  }

  const newData = users[+req.params.id]

  fs.writeFile(`../dev-data/data/tour.json`, JSON.stringify(users), err => {
    res.status(200).json({
      status: 'success',
      newData
    })
  })
}

function deleteTour(req, res) {

  if (+req.params.id > users.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  const deletedTour = users[req.params.id];
  users.splice(req.params.id, 1)

  fs.writeFile(`../dev-data/data/tour.json`, JSON.stringify(users), err => {
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

module.exports = { getAll, addOne, getOne, updateOne, deleteTour, getTime }