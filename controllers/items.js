const Item = require('../models/item.js')

exports.create_item = (req, res) => {

  const parent_id = req.params.item_id
  const {content} = req.body || req.query

  if(!content) return res.status(400).send(`Missing content`)

  const new_item = new Item({
    content,
    parent_id,
    date: new Date(),
    likes: 0,
  })

  new_item.save()
  .then((result) => {
    console.log(`[Mongoose] New item inserted`)
    res.send(result)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send('Error')
  })
}

exports.read_item = (req, res) => {

  const {item_id} = req.params
  if(!item_id) return res.status(400).send(`Item ID not defined`)

  Item.findById(item_id)
  .then(item => {
    console.log(`[Mongoose] Item ${item_id} queried`)
    res.send(item)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}

exports.update_item = (req, res) => {
  const {item_id} = req.params
  if(!item_id) return res.status(400).send(`Item ID not defined`)

  const new_properties = req.body

  Item.updateOne({_id: item_id}, new_properties)
  .then((result) => {
    console.log(`[Mongoose] Item ${item_id} updated`)
    res.send(result)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}

exports.vote = (req, res) => {
  const {item_id} = req.params
  if(!item_id) return res.status(400).send(`Item ID not defined`)

  const {vote} = req.body
  if(!vote) return res.status(400).send('Vote not present in request body')

  const update = { $inc: { likes: req.body.vote } }

  Item.updateOne({_id: item_id}, update)
  .then((result) => {
    console.log(`[Mongoose] Item ${item_id} updated`)
    res.send(result)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}

exports.delete_item = (req, res) => {
  const {item_id} = req.params
  if(!item_id) return res.status(400).send(`Item ID not defined`)

  Item.deleteOne({_id: item_id})
  .then(() => {
    console.log(`[Mongoose] Item ${item_id} deleted`)
    res.send('OK')
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}

exports.read_all_items = (req, res) => {

  const parent_id = req.params.item_id
  const query = { parent_id: parent_id ? parent_id : {$exists: false} }

  Item.find(query)
  .then(items => {
    console.log(`[Mongoose] Items queried`)
    res.send(items)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}
