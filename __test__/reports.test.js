const moment = require('moment')
const { create, get, update, remove } = require('../lib/reports')
const store = require('../lib/stores/memorystore')
jest.mock('../lib/stores/memorystore', () => ({
  create: jest.fn().mockName('store.create').mockResolvedValue(),
  get: jest.fn().mockName('store.get').mockResolvedValue(),
  update: jest.fn().mockName('store.update').mockResolvedValue(),
  remove: jest.fn().mockName('store.remove').mockResolvedValue()
}))

describe('reports', () => {
  beforeEach(() => {
    store.create.mockRestore()
    store.create.mockResolvedValue({ writeTime: { seconds: moment().unix() } })
    store.get.mockRestore()
    store.update.mockRestore()
    store.remove.mockRestore()
  })
  describe('#create', () => {
    it('creates a document', async () => {
      await create({})
      expect(store.create).toHaveBeenCalledTimes(1)
      expect(store.create).toHaveBeenCalledWith(
        expect.any(String),
        {}
      )
    })
    it('retries if document exists', async () => {
      store.create.mockRejectedValueOnce(new Error('Document exists'))
      await create({})
      expect(store.create).toHaveBeenCalledTimes(2)
      expect(store.create).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        {}
      )
    })
    it('returns a valid id', async () => {
      const { id } = await create({})
      expect(id).toMatch(/^[ABCDEFGHIJKLMNPQRSTUVXYZ123456789]{6}$/)
    })
  })
  describe('#get', () => {
    let data
    beforeEach(() => {
      data = { foo: 'bar' }
      store.get.mockResolvedValue({ data: () => data, createTime: { seconds: moment().unix() } })
    })
    it('retrieves a document', async () => {
      const id = 'ABC123'
      await get(id)
      expect(store.get).toHaveBeenCalledTimes(1)
      expect(store.get).toHaveBeenCalledWith('cases/ABC123')
    })
    it('returns the document data', async () => {
      const id = 'ABC123'
      const result = await get(id)
      expect(result.data).toEqual(data)
    })
  })
  describe('#update', () => {
    it('updates the document', async () => {
      const id = 'ABC123'
      const data = { foo: 'bar' }
      await (update(id, data))
      expect(store.update).toHaveBeenCalledTimes(1)
      expect(store.update).toHaveBeenCalledWith('cases/ABC123', data)
    })
  })
  describe('#remove', () => {
    it('removes the document', async () => {
      const id = 'ABC123'
      await (remove(id))
      expect(store.remove).toHaveBeenCalledTimes(1)
      expect(store.remove).toHaveBeenCalledWith('cases/ABC123')
    })
  })
})
