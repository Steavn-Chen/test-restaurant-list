const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/new', (req, res) => {
  const body = req.body
  const userId = req.user._id
  Restaurant.create({ ...body, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.error(err))
})
router.get('/:res_id', (req, res) => {
  const resId = req.params.res_id
  const userId = req.user._id
  return Restaurant.findOne({ _id: resId, userId })
    .lean()
    .then((restaurant) => {
      res.render('show', { restaurant })
    })
    .catch((err) => console.error(err))
})
router.get('/:res_id/edit', (req, res) => {
  const resId = req.params.res_id
  const userId = req.user._id
  return Restaurant.findOne({ _id: resId, userId })
    .lean()
    .then((restaurant) => {
      res.render('edit', { restaurant })
    })
    .catch((err) => console.error(err))
})
router.put('/:res_id', (req, res) => {
  const resId = req.params.res_id
  const userId = req.user._id
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  } = req.body
  return Restaurant.updateOne(
    { _id: resId, userId },
    {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    },
    {
      new: true,
      upsert: true,
      rawResult: true
    }
  )
    .then((restaurant) => {
      res.redirect(`/restaurants/${resId}/edit`)
    })
    .catch((err) => console.error(err))
})
router.delete('/:res_id', (req, res) => {
  const resId = req.params.res_id
  const userId = req.user._id
  return Restaurant.deleteOne({ _id: resId, userId })
    .then(() => res.redirect('/'))
    .catch((err) => console.error(err))
})

module.exports = router