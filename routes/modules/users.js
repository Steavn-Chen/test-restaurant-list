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
}))
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  console.log(name, email, password, confirmPassword)
  // if (!name || !email || !password || !confirmPassword) {
  //   console.log('所有欄位都是必填的 !')
  //   res.render('register', {
  //     name,
  //     email,
  //     password,
  //     confirmPassword,
  //   })
  // }
  // if (password !== confirmPassword) {
  //   console.log('密碼與確認密碼不相符 !')
  //   res.render('register', {
  //     name,
  //     email,
  //     password,
  //     confirmPassword,
  //   })
  // }
  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        console.log('這個電子郵件己經被註冊了。')
        return res.render('register', { 
          name, 
          email, 
          password, 
          confirmPassword })
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
  res.redirect('/users/login')
})

module.exports = router
