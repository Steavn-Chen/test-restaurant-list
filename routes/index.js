const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth.js')
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')
const sort = require('./modules/sort')
const users = require('./modules/users.js')

router.use('/users', users)
router.use('/restaurants', authenticator, restaurants)
router.use('/search', authenticator, search)
router.use('/sort', authenticator, sort)
router.use('/', authenticator, home)

module.exports = router;
