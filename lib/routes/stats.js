const { Router } = require('express')
const { stats: votesStats } = require('../votes')
const router = Router()

router.get('/', async (_, res, next) => {
  try {
    const votes = await votesStats()
    res.send({ votes })
  } catch (err) {
    next(err)
  }
})

module.exports = router
