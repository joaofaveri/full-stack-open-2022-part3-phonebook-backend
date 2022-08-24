const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

// Create new morgan token
morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
// Use morgan middleware for logging
app.use(morgan('tiny'))
app.use(morgan(':body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generatepersonId = () => {
  return Math.floor(Math.random() * 9999)
}

// Only to test server
app.get('/', (request, response) => {
  response.json({
    api: 'Phonebook'
  })
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const entriesInPhonebook = persons.length
  const request_at = new Date()
  response.send(`<p>Phonebook has info for ${entriesInPhonebook} people</p>
    <p>${request_at}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)
  const personExists = persons.find(person => person.id === personId)

  if (!personExists) {
    return response.status(400).json({
      error: 'Person not found'
    }).end()
  }
  response.json(personExists)
})

app.delete('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)
  const personExists = persons.find(person => person.id === personId)

  if (!personExists) {
    return response.status(400).json({
      error: 'Person not found'
    }).end()
  }

  persons = persons.filter(person => person.id !== personId)
  response.status(204)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  const nameAlreadyExists = persons.find(person => person.name === body.name)

  if (nameAlreadyExists) {
    return response.status(400).json({
      error: 'The name already exists in the phonebook'
    })
  }

  const person = {
    id: generatepersonId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.status(201).json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server is running on port ${PORT}`);