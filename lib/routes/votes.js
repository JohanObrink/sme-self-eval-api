const { Router } = require('express')
const { vote } = require('../votes')
const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const { id } = await vote(req.body)
    res.status(201).send({ id })
    next()
  } catch (err) {
    next(err)
  }
})

module.exports = router
