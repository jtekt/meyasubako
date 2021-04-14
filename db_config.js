const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID


exports.mongodb_options = {
  useUnifiedTopology: true,
}

exports.db_config = {
  db_url: process.env.MONGODB_URL,
  db_name : 'feedback_gathering_system',
  monku_collection_name : 'monku',
  proposals_collection_name : 'proposals',
}

exports.MongoClient = MongoClient

exports.ObjectID = ObjectID
