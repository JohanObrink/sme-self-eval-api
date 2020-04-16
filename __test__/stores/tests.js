/* eslint-disable jest/no-export */
const moment = require('moment')

module.exports = ({ create, get, update, remove }) => {
  const id = 'cases/foo'
  afterEach(async () => await remove(id))
  describe('#create', () => {
    it('stores a document', async () => {
      const data = { herp: 'derp' }
      await create(id, data)

      const doc = await get(id)
      expect(doc.data()).toEqual(data)
    })
    it('throws if a document exists', async () => {
      const data = { herp: 'derp' }
      await create(id, data)

      await expect(create(id, data))
        .rejects.toThrow('Document exists')
    })
    it('returns id and writeTime', async () => {
      const start = moment().unix()
      const data = { herp: 'derp' }
      const result = await create('cases/foo', data)
      const end = moment().unix()

      expect(result.id).toEqual('foo')
      expect(result.writeTime.seconds).toBeGreaterThanOrEqual(start)
      expect(result.writeTime.seconds).toBeLessThanOrEqual(end)
    })
    it('creates id if not supplied', async () => {
      const start = moment().unix()
      const data = { herp: 'derp' }
      const result = await create('cases', data)
      const end = moment().unix()

      expect(result.id).toEqual(expect.any(String))
      expect(result.writeTime.seconds).toBeGreaterThanOrEqual(start)
      expect(result.writeTime.seconds).toBeLessThanOrEqual(end)
    })
  })
  describe('#update', () => {
    it('updates a document', async () => {
      const data = { herp: 'derp' }
      await create(id, data)
      data.foo = 'bar'
      await update(id, data)

      const doc = await get(id)
      expect(doc.data()).toEqual(data)
    })
    it('throws if a document does not exist', async () => {
      const data = { herp: 'derp' }

      await expect(update(id, data))
        .rejects.toThrow('Document does not exist')
    })
  })
}
