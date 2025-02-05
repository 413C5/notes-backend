const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } 
  else {
    response.status(404).end()
  }
})


notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


notesRouter.post('/', async (request, response) => {
  //Tiene que tener la sintaxis del objeto
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const noteUpdate = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, noteUpdate, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter