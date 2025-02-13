const express = require('express')
const app = express()

// Read the database from a file ./db.json (to be replaced with a real database later on)
const data = require('./db.json')
console.log("Database read from file:", data);

// Return the full data in JSON
app.get('/api/persons', (request, response) => {
    response.json(data)
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
