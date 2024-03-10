//mongodb+srv://fullstack:<password>@cluster0.ezwn4oa.mongodb.net/?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('ERROR, need provide password : node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length < 4) {
    console.log('ERROR, need provide message : node mongo.js <password> <message>')
    process.exit(1)
}

const password = process.argv[2]
const message=process.argv[3]

const url = `mongodb+srv://fullstack:${password}@cluster0.ezwn4oa.mongodb.net/app-note-test?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content:String,
    date:Date,
    important:Boolean
})

const Note= mongoose.model('Note',noteSchema)

const note = new Note({
    content: message,
    date: new Date(),
    important: true,
  })

//Insert
note.save().then(result=>{
    console.log('note saved!')
    console.log(result)
    mongoose.connection.close()
})

//Select
/* Note.find({important:false}).then(result=>{
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
}) */