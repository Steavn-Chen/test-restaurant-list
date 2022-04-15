if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const router = require('./routes')
const userPassport = require('./config/passport.js')
const helpers = require('./tools/helpers.js')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs", helpers }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
userPassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  // res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})
app.use(router)

app.listen(PORT, () => {
  console.log(`The web is running http://localhost:${PORT}`)
})