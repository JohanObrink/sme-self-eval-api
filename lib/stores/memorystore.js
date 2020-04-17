const { createHash, randomBytes } = require('crypto')
const moment = require('moment')
const store = {}

const wrap = (data) => {
  return {
    data: () => data,
    createTime: { seconds: moment().unix() }
  }
}

const create = async (id, data) => {
  let [collection, documentId] = id.split('/')
  if (!documentId) {
    documentId = createHash('md5').update(randomBytes(16)).digest().toString('hex')
    id = `${collection}/${documentId}`
  }
  data = wrap({ ...data })
  if (store[id]) {
    throw new Error('Document exists')
  }
  store[id] = data
  return { id: documentId, writeTime: { seconds: moment().unix() } }
}

const get = async (id) => {
  return store[id] || { data: () => undefined }
}

const update = async (id, data) => {
  const [, documentId] = id.split('/')
  if (!store[id]) {
    throw new Error('Document does not exist')
  }
  store[id] = wrap({ ...data })
  return { id: documentId, writeTime: { seconds: moment().unix() } }
}

const save = async (id, data) => {
  const [, documentId] = id.split('/')
  store[id] = wrap({ ...data })
  return { id: documentId, writeTime: { seconds: moment().unix() } }
}

const remove = async (id) => {
  delete store[id]
}

module.exports = {
  create,
  get,
  update,
  remove,
  save
}
