const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim()
  const userId = req.user._id
  let errorMessage
  if (!keyword) {
    errorMessage = '請輸入想要搜尋的字元 !'
    return res.render('errorSearch', { message: errorMessage })
  }
  return Restaurant.find(
    {
      $and: [
        { userId },
        {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } }
          ]
        }
      ]
    }
  )
    .lean()
    .then((restaurants) => {
      if (restaurants.length === 0) {
        errorMessage = '沒有找到相關字元的餐廳 !'
        return res.render('errorSearch', { message: errorMessage })
      }

      res.render('index', { restaurants: restaurants })
    })
    .catch((err) => console.error(err))
})

module.exports = router
