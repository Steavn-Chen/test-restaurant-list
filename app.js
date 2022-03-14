const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const router = require('./routes')
const helpers = require('./tools/helpers.js')
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

mongoose.connect("mongodb://localhost/restaurant-list-g", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb is error')
})
db.once('open', () => {
  console.log('mongodb is connected')
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs", helpers }));
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(router)

app.listen(port, () => {
  console.log(`The web is running http://localhost:${port}`)
})