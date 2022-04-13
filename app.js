const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const session = require('express-session')
const router = require('./routes')
const userPassport = require('./config/passport.js')
const helpers = require('./tools/helpers.js')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs", helpers }));
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(session({
  secret: 'RestaurantIsSecret',
  resave: false,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  console.log(req.headers.cookie)
  console.log(req.session)
  console.log(req.sessionID)
  next()
})
userPassport(app)
app.use(router)

app.listen(port, () => {
  console.log(`The web is running http://localhost:${port}`)
})