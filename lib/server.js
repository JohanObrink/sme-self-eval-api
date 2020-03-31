const { logger } = require('./logging')
const app = require('./app')

const port = process.env.PORT || 3000
app.listen(port, () => logger.info(`Listening on :${port}`))
