const moment = require('moment')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRSTUVXYZ123456789', 6)
const stores = require('./stores')
const store = stores.get()

const COLLECTION = 'cases'

const create = async (data) => {
  try {
    const id = nanoid()
    const result = await store.create(`${COLLECTION}/${id}`, data)
    return { id, createTime: moment.unix(result.writeTime.seconds).toISOString() }
  } catch (err) {
    if (err.message === 'Document exists') {
      return create(data)
    } else {
      throw err
    }
  }
}

const get = async (id) => {
  const doc = await store.get(`${COLLECTION}/${id}`)
  return doc.data() && ({
    id,
    data: doc.data(),
    createTime: moment.unix(doc.createTime.seconds).toISOString()
  })
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
