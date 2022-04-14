const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/:type/:order', (req, res) => {
  const { type, order } = req.params
  return Restaurant.find()
    .lean()
    .sort({ [type]: [order] })
    .then((restaurants) => {
      return res.render('index', { restaurants })
    })
    .catch((err) => console.log(err))
})

module.exports = router