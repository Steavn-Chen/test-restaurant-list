const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
    session: false
  }, (req,email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          // return done(null, false, req.flash('error_msg', '這個帳號還沒被註冊。'))
          // return done(null, false, { type: 'error_msg', message: '這個帳號還沒被註冊。'})
          return done(null, false, { message: '這個帳號還沒被註冊。'})
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) { return done(null, false, { message: '電郵或密碼錯誤。'})}
            // if (user.password !== password) {
            //   // return done(null, false, req.flash('error_msg', '電郵或密碼錯誤 !'))
            //   // return done(null, false, { type: 'error_msg', message: '電郵或密碼錯誤。' })
            //   return done(null, false, { message: '電郵或密碼錯誤。' })
            // }
            return done(null, user)
          })
          .catch(err => done(err, false))
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