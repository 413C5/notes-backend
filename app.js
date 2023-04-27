const config = require('./utils/config')
const { request, response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

//const url = process.argv[2]

logger.info('connecting to', url)

mongoose.connect(url)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(express.static('build'))

app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(middleware.unknownPath)

module.exports = app