const stores = require('./stores')
const store = stores.get()

const vote = async ({ vote, reportId }) => {
  const voteRef = await store.create('votes', { vote, reportId })
  return voteRef
}

const remove = async () => {

}

module.exports = {
  vote,
  remove
}
