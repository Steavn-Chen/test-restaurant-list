const express = require('express')
const exphbs = require('express-handlebars')

const RestaurantList = require('./restaurant.json')

const app = express()
const port = 3000

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  console.log(RestaurantList);
  res.render('index', { restaurants: RestaurantList.results })
})

app.get('/restaurants/:res_id', (req, res) => {
  const resId = req.params.res_id
  const restaurant = RestaurantList.results.find(i => {
    return i.id.toString() === resId.toString()
  })
  res.render('show', { restaurant })

})

app.listen(port, () => {
  console.log(`The web is running http://localhost:${port}`)
})