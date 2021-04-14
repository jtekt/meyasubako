const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const db_name = 'feedback_gathering_system'
const monku_collection_name = 'monku'
const proposals_collection_name = 'proposals'

const mongodb_options = {
  useUnifiedTopology: true,
}


exports.vote = (req, res) => {

  let proposal_id = req.params.proposal_id
  let id = proposal_id || req.params.monku_id

  let collection = monku_collection_name
  if(proposal_id) collection = proposals_collection_name

  if(!id) return res.status(400).send('ID not defined')
  if(!('vote' in req.body)) return res.status(400).send('Vote not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let filter = {
      _id: ObjectID(id)
    }

    let update = {
      $inc: {
        likes: req.body.vote
      }
    }

    let options = {returnOriginal:false}

    db.db(db_name)
    .collection(collection)
    .findOneAndUpdate(filter, update, options, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
}
