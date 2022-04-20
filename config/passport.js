const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github-oauth20').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user.js')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
    session: false
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          // return done(null, false, req.flash('error_msg', '這個帳號還沒被註冊。'))
          // return done(null, false, { type: 'error_msg', message: '這個帳號還沒被註冊。'})
          return done(null, false, { message: '這個帳號還沒被註冊。' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: '電郵或密碼錯誤。' })
            }
            //   // return done(null, false, req.flash('error_msg', '電郵或密碼錯誤 !'))
            //   // return done(null, false, { type: 'error_msg', message: '電郵或密碼錯誤。' })
            //   return done(null, false, { message: '電郵或密碼錯誤。' })
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  })
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['displayName', 'email']
      },
      function (accessToken, refreshToken, profile, done) {
        const { email, name } = profile._json
        const randomPassword = Math.random().toString(36).slice(-8)
        //  findOne 寫法
        // User.findOne({ email }).then((user) => {
        //   if (user) {
        //     return done(null, user)
        //   }
        //   return bcrypt
        //     .genSalt(10)
        //     .then((salt) => bcrypt.hash(randomPassword, salt))
        //     .then((hash) =>
        //       User.create({
        //         name,
        //         email,
        //         password: hash,
        //       })
        //     )
        //     .then((user) => done(null, user))
        //     .then((err) => done(err, false))
        // })
        // findOrCreate 第一種寫法
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) =>
            User.findOrCreate(
              { email },
              {
                email,
                name,
                password: hash,
              },
              function (err, user) {
                if (err) {
                  return done(err, false)
                }
                return done(null, user)
              }
            )
          )
          .catch((err) => done(err, false))
        // findOrCreate 第二種寫法
        // bcrypt
        //   .genSalt(10)
        //   .then((salt) => bcrypt.hash(randomPassword, salt))
        //   .then((hash) =>
        //     User.findOrCreate(
        //       { email },
        //       {
        //         email,
        //         name,
        //         password: hash,
        //       },
        //       function (err, user) {
        //         console.log('A new uxer from "%s" was inserted', user)
        //         return done(err, user)
        //       }
        //     )
        //   )
      }
    )
  )
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
        profileFields: ['displayName', 'email']
      },
      function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json
        const randomPassword = Math.random().toString(36).slice(-10)
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) => {
            return User.findOrCreate(
              { email },
              { email, name, password: hash },
              (err, user) => {
                return done(err, user)
              }
            )
          })
          .catch((err) => done(err, false))
      }
    )
  )
  passport.use(
    new GitHubStrategy(
      {
        clientID: 'fcb60b43fdc10293effb',
        clientSecret: '3dd7cc1ff4c6f3c471a7b70dc3981618c118705b',
        callbackURL: process.env.GITHUB_CLIENT_CALLBACK,
      },
      function (accessToken, refreshToken, profile, done) {
        const randomPassword = Math.random().toString(36).slice(-8)
        const { login, emails } = profile._json
        bcrypt.genSalt(10).then((salt) => bcrypt.hash(randomPassword, salt))
          .then(hash => {
            User.findOrCreate(
              { email: emails[0].value },
              { email: emails[0].value ,
                name: login,
                password: hash 
              },
              (err, user) => {
              return done(err, user)
            })
          })
      }
    )
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