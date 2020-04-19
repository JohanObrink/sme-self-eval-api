const express = require('express')
const { json } = require('body-parser')
const cors = require('cors')
const { requestLogger } = require('./logging')
const cases = require('./routes/cases')
const reports = require('./routes/reports')
const votes = require('./routes/votes')
const stats = require('./routes/stats')

const app = express()
app.use(cors())
app.use(json())
app.use(requestLogger)
app.get('/', (_, res) => res.send({ message: 'Hello World!' }))

app.use('/cases', cases)
app.use('/reports', reports)
app.use('/votes', votes)
app.use('/stats', stats)

module.exports = app
