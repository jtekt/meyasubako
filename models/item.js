const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  content: String,
  parent_id: mongoose.Schema.Types.ObjectId,
  likes: Number,
  date: Date,
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
