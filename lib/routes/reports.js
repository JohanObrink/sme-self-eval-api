const { Router } = require('express')
const router = Router()
const { create, get, update } = require('../reports')

router.post('/', async (req, res, next) => {
  try {
    const result = await create(req.body)
    res.status(201).send(result)
    next()
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const id = (req.params.id || '').toUpperCase()
  try {
    const doc = await get(id)
    if (doc) {
      res.status(200).send(doc)
    } else {
      res.sendStatus(404)
    }
    next()
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  const id = (req.params.id || '').toUpperCase()
  const data = req.body
  try {
    await update(id, data)
    res.sendStatus(204)
    next()
  } catch (err) {
    if (err.message === 'Document does not exist') {
      res.sendStatus(404)
      next()
    } else {
      next(err)
    }
  }
})

module.exports = router
