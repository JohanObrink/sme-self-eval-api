const express = require('express')
const { json } = require('body-parser')
const { requestLogger } = require('./logging')
const cases = require('./routes/cases')

const app = express()
app.use(json())
app.use(requestLogger)
app.get('/', (_, res) => res.send({ message: 'Hello World!' }))

app.use('/cases', cases)

module.exports = app
