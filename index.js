const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const app = express()

app.use(express.json())

morgan.token('body', req => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Read the database from a file ./db.json (to be replaced with a real database later on)
const data = JSON.parse(fs.readFileSync('./db.json'))

// Return an info page
app.get('/info', (request, response) => {
  const info =
    `Phonebook has info for ${data.persons.length} people<br>
    ${new Date()}`

  response.send(info)
})

// Return the full data in JSON
app.get('/api/persons', (request, response) => {
  response.json(data.persons)
})

// Return a single person in JSON, status code 404 if not found
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = data.persons.find(person => person.id === id)

  if (!person) {
    return response.status(404).end()
  } else {
    response.json(person)
  }
})

// Add a new person (with a random id), returns status code 201 if successful, 400 if not (missing data or a duplicate)
// Note: Does not add the person to the database file (yet), only to the memory
app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person || !person.name || !person.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  if (data.persons.find(p => p.name === person.name)) {
    return response.status(400).json({ error: 'user exists already' })
  }

  person.id = Math.floor(Math.random() * 1000000)

  data.persons = data.persons.concat(person)
  response.status(201).json(person)
})

// Delete a single person, status code 204 if successful, 404 if not found
// Note: Does not delete the person from the database file (yet), only from the memory
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = data.persons.find(person => person.id === id)

  if (!person) {
    return response.status(404).end()
  } else {
    data.persons = data.persons.filter(person => person.id !== id)
    response.status(204).end()
  }
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
