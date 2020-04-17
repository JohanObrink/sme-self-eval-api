const stores = require('./stores')
const store = stores.get()

const AGGREGATE_ID = 'stats/votes'

const vote = async ({ vote, reportId }) => {
  const voteRef = await store.create('votes', { vote, reportId })
  const aggregate = (await store.get(AGGREGATE_ID)).data() || { '-1': 0, 1: 0 }
  if (vote === -1) {
    aggregate['-1']++
  } else {
    aggregate['1']++
  }
  await store.save(AGGREGATE_ID, aggregate)
  return voteRef
}

const stats = async () => {
  const aggregate = await store.get(AGGREGATE_ID)
  return aggregate.data()
}

module.exports = {
  stats,
  vote
}
