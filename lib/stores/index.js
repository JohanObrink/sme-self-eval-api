module.exports = {
  get: () => {
    if (process.env.STORE === 'memory') {
      return require('./memorystore')
    } else {
      return require('./firestore')
    }
  },
}
