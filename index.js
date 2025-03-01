const express = require('express')
const fs = require('fs')
const app = express()

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

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
