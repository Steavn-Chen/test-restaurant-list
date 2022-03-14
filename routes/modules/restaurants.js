const express = require("express");
const router = express.Router();

const Restaurant = require("../../models/restaurant");

router.get("/new", (req, res) => {
  res.render("new");
});
router.post("/new", (req, res) => {
  const body = req.body;
  Restaurant.create(body)
    .then(() => res.redirect("/"))
    .catch((err) => console.error(err));
});
router.get("/:res_id", (req, res) => {
  const resId = req.params.res_id;
  return Restaurant.findById(resId)
    .lean()
    .then((restaurant) => {
      res.render("show", { restaurant });
    })
    .catch((err) => console.error(err));
});
router.get("/:res_id/edit", (req, res) => {
  const resId = req.params.res_id;
  return Restaurant.findById(resId)
    .lean()
    .then((restaurant) => {
      res.render("edit", { restaurant });
    })
    .catch((err) => console.error(err));
});
router.put("/:res_id", (req, res) => {
  const resId = req.params.res_id;
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  // 第一種方法
  // return Restaurant.update(
  return Restaurant.updateOne(
  // return Restaurant.findByIdAndUpdate(
  // return Restaurant.findOneAndUpdate(
    { _id: resId },
    {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
      // useFindAndModify: false,
    }
  )
    .then((restaurant) => {
      // res.render("edit", { restaurant: restaurant });
      res.redirect(`/restaurants/${resId}/edit`);
    })
    .catch((err) => console.error(err));
  // 編輯第二種方法
  // const body = req.body
  // return Restaurant.findById(resId)
  // .then(restaurant => {
  //   Object.assign(restaurant, body).save()
  // })
  // .then((restaurant) => res.render('edit', { restaurant }))
  // .catch(err => console.error(err))
  // 編輯第三種方法
  // return (
  //   Restaurant.findById(resId)
  //     .then((restaurant) => {
  //       console.log(restaurant);
  //       (restaurant.name = name),
  //         (restaurant.name_en = name_en),
  //         (restaurant.category = category),
  //         (restaurant.image = image),
  //         (restaurant.location = location),
  //         (restaurant.phone = phone),
  //         (restaurant.google_map = google_map),
  //         (restaurant.rating = Number(rating)),
  //         (restaurant.description = description);
  //       console.log(restaurant);
  //       return restaurant.save();
  //     })
  //     .then((restaurant) => res.redirect(`/restaurants/${resId}/edit`))
  //     .catch((err) => console.error(err))
  // );
});
router.delete("/:res_id", (req, res) => {
  const resId = req.params.res_id;
  // 第一種方法
  // return Restaurant.findById({ _id: resId})
  // .then(res => {
  //   return res.remove()
  // })
  // .then(() => res.redirect('/'))
  // .catch(err => console.error(err))
  // 第二種方法
  return Restaurant.deleteOne({ _id: resId })
    .then(() => res.redirect("/"))
    .catch((err) => console.error(err));
});

module.exports = router;


