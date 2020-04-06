/* eslint-disable jest/no-export */

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
