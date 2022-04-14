const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  return Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
})
router.post('/', (req, res) => {
  const interFaceModel = req.body.displayMode
  return Restaurant.find()
    .lean()
    .then((restaurants) =>
      res.render('index', { restaurants, interFaceModel })
    )
})

module.exports = router