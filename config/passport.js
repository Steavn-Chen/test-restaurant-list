const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    // session: false
  }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        console.log('有找到',user)
        if (!user) {
          console.log('這個電郵還未被註冊 !')
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
    console.log('序列化',user)
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    console.log(id)
    User.findById(id)
      .lean()
      .then(user => {
        console.log('反序列化',user)
        return done(null, user)
      })
      .catch(err => done(err, null))
  })
}