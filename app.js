const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

mongoose.connect("mongodb://localhost/restaurant-list-g", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb is error')
})
db.once('open', () => {
  console.log('mongodb is connected')
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  return Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants })
  )
})
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
app.post("/restaurants/new", (req, res) => {
  const body = req.body
  Restaurant.create(body)
  .then(() => res.redirect('/'))
  .catch(err => console.error(err))
});

app.get('/restaurants/:res_id', (req, res) => {
  const resId = req.params.res_id
  const restaurant = RestaurantList.results.find(i => {
    return i.id.toString() === resId.toString()
  })
  res.render('show', { restaurant })

})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  let errorMessage 
  if (!keyword) {
    errorMessage = '請輸入想要搜尋的字元 !'
    res.render('errorSearch', { message: errorMessage})
  }
  const restaurants = RestaurantList.results.filter(i => {
    return (
      i.name.toLowerCase().trim().includes(keyword.toLowerCase()) ||
      i.category.toLowerCase().trim().includes(keyword.toLowerCase())
    );
  })
  // if (restaurants.length === 0) {
  //   errorMessage = "沒有找到相應字元的餐廳 !";
  //   res.render("errorSearch", { message: errorMessage });
  // }
  res.render('index', { restaurants })
})

app.listen(port, () => {
  console.log(`The web is running http://localhost:${port}`)
})