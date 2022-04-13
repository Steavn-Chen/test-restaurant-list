const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  const keyword = req.query.keyword.trim()
  let errorMessage;
  if (!keyword) {
    errorMessage = "請輸入想要搜尋的字元 !";
    return res.render("errorSearch", { message: errorMessage });
  }
  // 第一種寫法
  return Restaurant.find({$or:[ { name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } } ]})
  .lean()
  .then(restaurants => {
    if (restaurants.length === 0) {
      errorMessage = "沒有找到相關字元的餐廳 !";
      return res.render("errorSearch", { message: errorMessage });
    }

    res.render('index', { restaurants: restaurants})
  })
  .catch(err => console.error(err))

  // 第二種寫法
  // return Restaurant.find()
  //   .lean()
  //   .then((restaurants) => {
  //     const results = restaurants.filter((i) => {
  //       return (
  //         i.name.toLowerCase().includes(keyword.toLowerCase()) ||
  //         i.category.toLowerCase().includes(keyword.toLowerCase())
  //       );
  //     });
  //     if (results.length === 0) {
  //       errorMessage = "沒有找到輸入相關字元的餐廳 !";
  //       return res.render("errorSearch", { message: errorMessage });
  //     }
  //     res.render("index", { restaurants: results });
  //   });
});

module.exports = router;
