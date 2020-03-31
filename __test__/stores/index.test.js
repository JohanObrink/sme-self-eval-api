const { get } = require('../../lib/stores')
const memorystore = require('../../lib/stores/memorystore')
const firestore = require('../../lib/stores/firestore')

describe('stores', () => {
  it('returns memorystore when STORE = memory', () => {
    process.env.STORE = 'memory'
    expect(get()).toEqual(memorystore)
  })
  it('returns firestore when STORE != memory', () => {
    process.env.STORE = ''
    expect(get()).toEqual(firestore)
  })
})
