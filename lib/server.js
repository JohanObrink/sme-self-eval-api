const express = require('express')
const { logger, requestLogger } = require('./logging')
const app = express()

app.use(requestLogger)
app.get('/', (_, res) => res.send({ message: 'Hello World!' }))

const port = process.env.PORT || 3000
app.listen(port, () => logger.info(`Listening on :${port}`))
