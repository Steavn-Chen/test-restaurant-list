const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user.js')

router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  // failureMessage: true,
  failureFlash: true
}))
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  console.log(req.body)
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填的。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符。' })
  }
  if (errors.length) {
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword,
      errors
    })
  }
  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        errors.push({ message: '這個電子郵件己經被註冊了。' })
        return res.render('register', { 
          name, 
          email, 
          password, 
          confirmPassword,
          errors 
        })
      }
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/users/login'))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出。')
  res.redirect('/users/login')
})

module.exports = router
