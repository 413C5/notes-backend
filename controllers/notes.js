const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => {
      console.log(error)
      response.status(500).send('Internal Server Error')
    })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
      //console.log(error)
      //response.status(400).send({ error: 'malformatted id' })
    })
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result !== null) {
        response.status(204).send()
      }
      else {
        response.status(404).send()
      }
    })
    .catch(error => {
      next(error)
      //console.log(error)
      //response.status(404).send()
    })
})

notesRouter.post('/', (request, response, next) => {
  //Tiene que tener la sintaxis del objeto
  const body = request.body
  console.log(body)
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  /* const note = Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  }) */

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => {
      next(error)
      //console.log(error)
      //response.status(500).send('Internal Server Error');
    })
})


notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const noteUpdate = {
    content: body.content,
    important: body.important,
    /* date: body.date */
  }

  Note.findByIdAndUpdate(request.params.id, noteUpdate, { new: true })
    .then(updatedNote => {
      if (updatedNote) {
        response.json(updatedNote)
      }
      else {
        response.status(404).send();
      }
    })
    .catch(error => {
      next(error)
      //console.log(error)
      //response.status(404).send()
    })
})

module.exports = notesRouter