const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    session: false
  }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '這個帳號還沒被註冊。'})
        }
        if (user.password !== password) {
          return done(null, false, { message: '電郵或密碼錯誤。'})
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  })
  )
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => {
        return done(null, user)
      })
      .catch(err => done(err, null))
  })
}