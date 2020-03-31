/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */

const { upAll, down } = require('docker-compose')
const firestore = require('../../lib/stores/firestore')
const test = require('./tests')

describe('stores/firestore', () => {
  beforeAll(async () => {
    await upAll({
      cwd: process.cwd(),
      log: true
    })
  })
  afterAll(async () => {
    await down({
      cwd: process.cwd(),
      log: true
    })
  })
  test(firestore)
})
