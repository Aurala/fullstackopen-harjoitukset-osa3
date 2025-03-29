require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    console.error('Invalid JSON:', err.stack)
    return res.status(400).send({ error: 'Invalid JSON' })
  }
  next(err)
})

morgan.token('body', req => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Return an info page
app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const info =
      `Phonebook has info for ${result.length} people<br>
      ${new Date()}`
    response.send(info)
  })
})

// Return all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    console.log('Persons:', result)
    response.json(result)
  })
})

// Return a single person, status code 404 if not found
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

// Add a new person, returns status code 201 if successful, 400 if not (missing data)
app.post('/api/persons', (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })

  newPerson.save().then(savedPerson => {
    console.log('Person saved:', savedPerson.id, savedPerson.name, savedPerson.number)
    response.status(201).json(savedPerson)
  }).catch(error => next(error))
})

// Delete a single person, status code 204 if successful, 404 if not found
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(result => {
    if (result) {
      console.log('Deleted person:', result.name)
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.use((err, req, res, next) => {
  console.error(err.name, err.message)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'id not a valid MongoDB ObjectId' })
  }
  next(err)
})

// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
