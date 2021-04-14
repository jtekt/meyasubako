const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const pjson = require('./package.json')


const items_controller = require('./controllers/items.js')

dotenv.config()

// Mongoose connection
const mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const mongodb_db = process.env.MONGODB_DB || 'user_manager_mongoose'
const mongoose_url = `${process.env.MONGODB_URL}/${mongodb_db}`

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoose_url, mongoose_options)

const db = mongoose.connection
db.on('error', console.error.bind(console, '[Mongoose] connection error:'))
db.once('open', () => { console.log('[Mongoose] Connected') })





const app_port = process.env.APP_PORT || 80

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res) => {
  res.send({

  })
})

// topics
app.route('/items')
  .post(items_controller.create_item)
  .get(items_controller.read_all_items)

app.route('/items/:item_id')
  .get(items_controller.read_item)
  .delete(items_controller.delete_item)

app.route('/items/:item_id/vote')
  .post(items_controller.vote)

app.route('/items/:item_id/items')
  .post(items_controller.create_item)
  .get(items_controller.read_all_items)

app.listen(app_port, () => console.log(`Mendokusai running on port ${app_port}`))
