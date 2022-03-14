const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  const keyword = req.query.keyword;
  let errorMessage;
  if (!keyword) {
    errorMessage = "請輸入想要搜尋的字元 !";
    return res.render("errorSearch", { message: errorMessage });
  }
  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const results = restaurants.filter((i) => {
        return (
          i.name.toLowerCase().includes(keyword.toLowerCase()) ||
          i.category.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      if (results.length === 0) {
        errorMessage = "沒有找到輸入相關字元的餐廳 !";
        return res.render("errorSearch", { message: errorMessage });
      }
      res.render("index", { restaurants: results });
    });
});

module.exports = router;
