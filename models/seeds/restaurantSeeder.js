require('../../config/mongoose.js')
const RestaurantList = require('./restaurant.json')
const Restaurant = require('../restaurant')

const db = require('../../config/mongoose.js')

// 第一種方法 setTimeout
// db.once('open', () => {
//   console.log('mongodb is connected!')
//   for(let i = 0; i < RestaurantList.results.length; i++) {
//     Restaurant.create(RestaurantList.results[i]);
//     console.log(i, RestaurantList.results.length);
//   }
//   setTimeout(() => {
//     db.close();
//     console.log('done!')
//   }, 2000);

// 第二種方法 insertMany
db.once('open', () => {
  Restaurant.insertMany(RestaurantList.results)
  .then(() => db.close())
  console.log('done!')
})

// 第三種方法 async 
// db.once("open", async () => {
//   console.log("mongodb is connected!");
//   for (let i = 0; i < RestaurantList.results.length; i++) {
//     await Restaurant.create(RestaurantList.results[i]);
//   }
//   db.close()
//   console.log('done!')
// });