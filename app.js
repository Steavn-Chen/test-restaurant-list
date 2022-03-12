const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

mongoose.connect("mongodb://localhost/restaurant-list-g", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb is error')
})
db.once('open', () => {
  console.log('mongodb is connected')
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  return Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants })
  )
})
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
app.post("/restaurants/new", (req, res) => {
  const body = req.body
  Restaurant.create(body)
  .then(() => res.redirect('/'))
  .catch(err => console.error(err))
});

app.get('/restaurants/:res_id', (req, res) => {
  const resId = req.params.res_id
  return Restaurant.findById(resId)
  .lean()
  .then(restaurant => {
    res.render('show', { restaurant})
  })
  .catch(err => console.error(err))
})
app.get("/restaurants/:res_id/edit", (req, res) => {
  const resId = req.params.res_id;
  return Restaurant.findById(resId)
    .lean()
    .then((restaurant) => {
      res.render("edit", { restaurant });
    })
    .catch((err) => console.error(err));
});
app.post("/restaurants/:res_id/edit", (req, res) => {
  const resId = req.params.res_id;
  const { name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description } = req.body
    // 第一種方法
    // return Restaurant.update(
    // return Restaurant.updateOne(
    return Restaurant.findByIdAndUpdate(
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
      }
      // { useFindAndModify: false }
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
app.post("/restaurants/:res_id/delete", (req, res) => {
  const resId = req.params.res_id;
  // 第一種方法
  // return Restaurant.findById({ _id: resId})
  // .then(res => {
  //   return res.remove()
  // })
  // .then(() => res.redirect('/'))
  // .catch(err => console.error(err))
  // 第二種方法
  return Restaurant.deleteOne({ _id: resId})
  .then(() => res.redirect('/'))
  .catch(err => console.error(err))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  let errorMessage 
  if (!keyword) {
    errorMessage = '請輸入想要搜尋的字元 !'
    res.render('errorSearch', { message: errorMessage})
  }
  const restaurants = RestaurantList.results.filter(i => {
    return (
      i.name.toLowerCase().trim().includes(keyword.toLowerCase()) ||
      i.category.toLowerCase().trim().includes(keyword.toLowerCase())
    );
  })
  // if (restaurants.length === 0) {
  //   errorMessage = "沒有找到相應字元的餐廳 !";
  //   res.render("errorSearch", { message: errorMessage });
  // }
  res.render('index', { restaurants })
})

app.listen(port, () => {
  console.log(`The web is running http://localhost:${port}`)
})