const db_config = require('../db_config.js')
const {MongoClient, ObjectID, mongodb_options} = db_config
const {db_name, monku_collection_name, proposals_collection_name} = db_config.db_config


exports.vote = (req, res) => {

  let proposal_id = req.params.proposal_id
  let id = proposal_id || req.params.monku_id

  let collection = monku_collection_name
  if(proposal_id) collection = proposals_collection_name

  if(!id) return res.status(400).send('ID not defined')
  if(!('vote' in req.body)) return res.status(400).send('Vote not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options)
  .then(db => {

    let filter = {  _id: ObjectID(id) }
    let update = {  $inc: { likes: req.body.vote } }
    let options = { returnOriginal:false }

    return db.db(db_name)
    .collection(collection)
    .findOneAndUpdate(filter, update, options)
  })
  .then(result => {
    res.send(result)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })

}
