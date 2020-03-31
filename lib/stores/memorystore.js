const store = {}

const create = async (id, data) => {
  if (store[id]) {
    throw new Error('Document exists')
  }
  store[id] = { ...data }
}

const get = async (id) => {
  return store[id]
}
const update = async (id, data) => {
  if (!store[id]) {
    throw new Error('Document does not exist')
  }
  store[id] = { ...data }
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
