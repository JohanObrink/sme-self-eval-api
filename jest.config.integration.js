const config = require('./jest.config')

process.env.NODE_ENV = 'test:integration'
process.env.STORE = process.env.STORE || 'emulator'
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'
process.env.FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID || 'corona-test'

module.exports = {
  ...config,
  testMatch: ['**/__test__/**/*.integration.js']
}
