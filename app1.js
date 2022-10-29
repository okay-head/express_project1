// get object with a given id
// A rest API which returns some object

const express = require('express')
const app = new express()
let data = require('./data')
const Joi = require('joi')

app.use(express.json()) //middleware to parse the request body object

// ____Handling GET Requests
app.get('/', (req, res) => {
  res.send('Enter the id of the resource you want to fetch. \n Eg. url/3 ')
})

app.get('/:id', (req, res) => {
  const ID = req.params.id
  const result =
    data.some(element => element.id == ID) &&
    data.filter(element => element.id == ID)

  if (!result) {
    res.status(404)
    res.send('Resource not found')
  } else res.send(result)
})

//____ Handling POST Requests

app.post('/resource', (req, res) => {
  //find the id of the next user
  const id = data.length + 1
  const { rank, verified } = req.body

  /** Validation using joi **/
  //Input Validation is important as you should never trust the user input
  const schema = Joi.object({
    id: Joi.number()
      .integer()
      .required(),
    rank: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .required(),
    verified: Joi.boolean().required()
  })
  const user = {
    id,
    rank,
    verified
  }

  const { error } = schema.validate(user)

  if (error) {
    res.status(400) //bad request
    res.send(error.details[0].message)
    return
  }
  data.push(user)
  res.send(user)
})

//____ Handling PUT Requests

// 2. Validate request body

// assuming they're all valid, update data

app.put('/resource/:id', (req, res) => {
  const element = data.find(el => el.id == req.params.id)
  if (!element) 
  return res.status(404).send('Resource not found')
  const { rank, verified } = req.body
  element.rank = rank
  element.verified = verified

  res.send(element)
})

app.delete('/resource/:id', (req, res) => {
   const element = data.find(el => el.id == req.params.id)
   if (!element) 
   return res.status(404).send('Resource not found')
 
   data = data.filter(el=>el.id!==Number(req.params.id))
   res.send(element)
})

const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
