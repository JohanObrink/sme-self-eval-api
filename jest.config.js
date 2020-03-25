process.env.FIRESTORE_EMULATOR_HOST =
  process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'
process.env.FIRESTORE_PROJECT_ID =
  process.env.FIRESTORE_PROJECT_ID || 'lightsout'

module.exports = {
  testEnvironment: 'node'
}
