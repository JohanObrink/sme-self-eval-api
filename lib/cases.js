const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVXYZ123456789', 6)
const stores = require('./stores')
const store = stores.get()

const COLLECTION = 'cases'

const create = async (data) => {
  try {
    const id = nanoid()
    await store.create(`${COLLECTION}/${id}`, data)
    return id
  } catch (err) {
    return create(data)
  }
}

const get = async (id) => {
  return await store.get(`${COLLECTION}/${id}`)
}

const update = async (id, data) => {
  return await store.update(`${COLLECTION}/${id}`, data)
}

const remove = async (id) => {
  return await store.remove(`${COLLECTION}/${id}`)
}

module.exports = {
  create,
  get,
  update,
  remove
}
