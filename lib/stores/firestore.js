const { Firestore } = require('@google-cloud/firestore')
const firestore = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID
})

const create = async (id, data) => {
  const [collection, documentId] = id.split('/')
  let ref
  if (documentId) {
    ref = firestore.doc(id)
    const existing = await ref.get()
    if (existing.data() !== undefined) {
      throw new Error('Document exists')
    }
  } else {
    ref = firestore.collection(collection).doc()
  }
  const { writeTime } = await ref.set(data)
  ref.writeTime = writeTime
  return ref
}

const get = async (id) => {
  const ref = firestore.doc(id)
  const doc = await ref.get()
  return doc
}

const update = async (id, data) => {
  const ref = firestore.doc(id)
  const doc = await ref.get()

  if (doc.data() === undefined) {
    throw new Error('Document does not exist')
  }
  const result = await ref.set(data)
  return result
}

const remove = async (id) => {
  const docRef = await firestore.doc(id)
  await docRef.delete()
}

module.exports = {
  create,
  get,
  remove,
  update
}
