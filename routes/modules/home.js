const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  return Restaurant.find({ userId })
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
})
router.post('/', (req, res) => {
  const interFaceModel = req.body.displayMode
  const userId = req.user._id
  return Restaurant.find({ userId })
    .lean()
    .then((restaurants) =>
      res.render('index', { restaurants, interFaceModel })
    )
})

module.exports = router