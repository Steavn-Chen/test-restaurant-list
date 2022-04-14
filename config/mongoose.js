const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/restaurant-list-g', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  // useFindAndModify: false,
})
const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb is error");
});
db.once("open", () => {
  console.log("mongodb is connected");
});

module.exports = db