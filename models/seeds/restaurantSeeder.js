const RestaurantList = require('./restaurant.json')
const Restaurant = require('../restaurant')

const db = require('../../config/mongoose.js')

db.once('open', () => {
  Restaurant.insertMany(RestaurantList.results)
  .then(() => db.close())
  console.log('done!')
})
