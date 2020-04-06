const store = {}

const wrap = (data) => {
  return {
    data: () => data
  }
}

const create = async (id, data) => {
  if (store[id]) {
    throw new Error('Document exists')
  }
  store[id] = wrap({ ...data })
}

const get = async (id) => {
  return store[id] || { data: () => undefined }
}
const update = async (id, data) => {
  if (!store[id]) {
    throw new Error('Document does not exist')
  }
  store[id] = wrap({ ...data })
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
