const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
  content: String,
  likes: Number,
  timestamp: Date,
})

const Topic = mongoose.model('Topic', topicSchema)

module.exports = Item
