require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())


morgan.token('req-body', (request) => JSON.stringify(request.body))
app.use(morgan(":method :url :status - :response-time ms - Body: :req-body"))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  } 

  next(error)

}

const unknownendpoint = (request, response ) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


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
  Person.find({})
    .then(data => {
      response.json(data)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (!person){
        return response.status(404).send('not found').end()
      }
      response.json(person)    
    })
    .catch(error => {
      next(error)
    })

  
})

app.post('/api/persons', (request, response, next) => {
  let body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'missing name and/or number'
    }).end()
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })
  // persons = [...persons, person]
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  
})

app.delete('/api/persons/:id', (request, response, next) => {

  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then( _ => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  Person.findById(request.params.id)
    .then(person => {

      if(!person){
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then(newPerson => {
          response.json(newPerson)
        })

    })
    .catch(error => next(error))
})

app.use(unknownendpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is alive on ${PORT}`);
  
})