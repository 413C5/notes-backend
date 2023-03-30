//const http = require('http')
const { response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let notes = [
    {
        "id": 1,
        "content": "HTML is Easy",
        "date": "2023-02-14",
        "important": false
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "date": "2023-02-15",
        "important": true
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "date": "2023-02-15",
        "important": false
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('--------------------------------------')
    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Notes API</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id=', id)
    const note = notes.find(x => x.id === id)
    console.log(note)

    //SI es un objeto
    if (note) {
        response.json(note)
    }
    //Es nulo
    else {
        response.status(404).send()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    let size = notes.length
    notes = notes.filter(x => x.id !== id)

    //Si mi tamaño anterior es mayor que el actual
    if (size > notes.length) {
        response.status(204).send()
    }

    else {
        response.status(404).send()
    }

})

const generateId = () => {
    const maxId = (() => {
        if (notes.length > 0) {
            return Math.max(...notes.map(x => x.id))
        }
        else {
            return 0
        }
    })()

    return maxId + 1

    /* const maxId=notes.length>0
      ?Math.max(...notes.map(x=>x.id))
      :0
    return maxId+1 */
}

app.post('/api/notes', (request, response) => {
    //Tiene que tener la sintaxis del objeto
    const body = request.body
    console.log(body)
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()

    }
    notes = notes.concat(note)
    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id=', id)
    const note = notes.find(x => x.id === id)
    const body = request.body
    const noteUpdate = {
        content: body.content,
        important: body.important,
        date: body.date,
        id: body.id

    }
    console.log(note)

    //SI es un objeto
    if (note) {
        notes = notes.map(x => x.id !== id ? x : noteUpdate)
        response.json(noteUpdate)
    }
    //Es nulo
    else {
        response.status(404).send()
    }
})

const unknownPath = (request, response) => {
    response.status(404).json({
        error: 'unknown Path'
    })
}

app.use(unknownPath)

//En que puerto se atendera el servidor
const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
