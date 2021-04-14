const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: String,
  topic_id: String,
  likes: Number,
  timestamp: Date,
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
