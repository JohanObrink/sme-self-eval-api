/* eslint-disable jest/expect-expect */

const request = require('supertest')
const app = require('../lib/app')
const store = require('../lib/stores').get()

describe('app', () => {
  describe('POST /cases', () => {
    it('persists data', async () => {
      const data = { foo: 'bar' }
      let id
      try {
        await request(app)
          .post('/cases')
          .send(data)
          .set('Content-Type', 'application/json')
          .expect(async (res) => {
            id = res.body.id
          })
          .expect(201)
        const stored = await store.get(`cases/${id}`)
        expect(stored).toEqual(data)
      } finally {
        await store.remove(`cases/${id}`)
      }
    })
  })
  describe('GET /cases/:id', () => {
    it('retrieves data', async () => {
      const id = 'ABC123'
      const data = { foo: 'bar' }
      try {
        await store.create(`cases/${id}`, data)
        await request(app)
          .get('/cases/abc123')
          .set('Accept', 'application/json')
          .expect((res) => {
            const result = res.body
            expect(result).toEqual(data)
          })
          .expect(200)
      } finally {
        await store.remove('cases/ABC123')
      }
    })
    it('returns 404 if document does not exist', async () => {
      await request(app)
        .get('/cases/abc123')
        .set('Accept', 'application/json')
        .expect(404)
    })
  })
  describe('PUT /cases/:id', () => {
    it('updates data', async () => {
      const id = 'ABC123'
      const data = { foo: 'bar' }
      try {
        await store.create(`cases/${id}`, data)
        data.foo = 'baz'
        await request(app)
          .put('/cases/abc123')
          .send(data)
          .set('Content-Type', 'application/json')
          .expect(204)
        const changed = await store.get(`cases/${id}`)
        expect(changed).toEqual(data)
      } finally {
        await store.remove('cases/ABC123')
      }
    })
    it('returns 404 if document does not exist', async () => {
      const data = { foo: 'bar' }
      await request(app)
        .put('/cases/abc123')
        .send(data)
        .set('Content-Type', 'application/json')
        .expect(404)
    })
  })
})
