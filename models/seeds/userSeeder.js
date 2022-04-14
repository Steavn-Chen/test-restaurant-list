if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const userData = require('./user.json')
const resData = require('./restaurant.json')
const User = require('../user.js')
const Restaurant = require('../restaurant.js')

const db = require('../../config/mongoose.js')

db.once('open', async () => {
  try {
    userData.results.forEach(async (user, uIndex) => {
      try {
        const { name, email, password } = user
        let newUser = await User.create({
          name,
          email,
          password,
        })
        const RES_LENGTH = 3
        for (let j = 0; j < RES_LENGTH; j++) {
          await Restaurant.create({
            ...resData.results[uIndex * RES_LENGTH + j],
            userId: newUser._id,
          })
          if (
            uIndex * RES_LENGTH + j ===
            userData.results.length * RES_LENGTH - 1
          ) {
            console.log('done !')
            process.exit()
          }
        }
      } catch (err) {
        console.warn(err)
      }
    })
  } catch (err) {
    console.warn(err)
  }
})
