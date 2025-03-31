const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('req-body', (request) => JSON.stringify(request.body))
app.use(morgan(":method :url :status - :response-time ms - Body: :req-body"))




let persons = [
  {
    id: "2",
    name: "Ray jack",
    number: "880-745321"
  },
  {
    id: "3",
    name: "Steve square",
    number: "089-452311"
  },
  {
    id: "4",
    name: "spongebob squarepants",
    number: "09-98787"
  },
  {
    id: "5",
    name: "sponge",
    number: "123"
  },
  {
    id: "6",
    name: "patrick",
    number: "092-123456"
  },
  {
    id: "7",
    name: "Yakub swaray",
    number: "31331313"
  }
]


const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
  return String(maxId + 1)
}


app.get('/', (request, response) => {
  response.send(`<h1>Welcome</h1>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(p => p.id === id)

  if (!person){
    return response.status(404).send('not found').end()
  }

  response.json(person)
  
})

app.post('/api/persons', (request, response) => {
  let person = request.body

  

  if(!person.name || !person.number){
    return response.status(400).json({
      error: 'missing name and/or number'
    }).end()
  }

  person = {...person, id: generateId()}
  persons = [...persons, person]
  response.json(person)

  
})

app.delete('/api/persons/:id', (request, response) => {

  const id = request.params.id

  if(!persons.some(p => p.id === id)){
    return response.status(404).send('id not in server').end()
  }

  persons = persons.filter(p => p.id !== id)
  
  response.status(204).end()
})

const PORT = process.env.PORT || 2000
app.listen(PORT, () => {
  console.log(`server is alive on ${PORT}`);
  
})