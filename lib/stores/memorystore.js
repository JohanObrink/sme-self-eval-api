const moment = require('moment')
const store = {}

const wrap = (data) => {
  return {
    data: () => data,
    createTime: { seconds: moment().unix() }
  }
}

const create = async (id, data) => {
  if (store[id]) {
    throw new Error('Document exists')
  }
  store[id] = wrap({ ...data })
  return { writeTime: { seconds: moment().unix() } }
}

const get = async (id) => {
  return store[id] || { data: () => undefined }
}
const update = async (id, data) => {
  if (!store[id]) {
    throw new Error('Document does not exist')
  }
  store[id] = wrap({ ...data })
  return { writeTime: { seconds: moment().unix() } }
}

const remove = async (id) => {
  delete store[id]
}

module.exports = {
  create,
  get,
  update,
  remove
}
