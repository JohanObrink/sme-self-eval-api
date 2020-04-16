/* eslint-disable jest/expect-expect */

const request = require('supertest')
const app = require('../lib/app')
const store = require('../lib/stores').get()
const moment = require('moment')

describe('app', () => {
  describe('/cases', () => {
    describe('POST /cases', () => {
      it('persists data', async () => {
        const data = { foo: 'bar' }
        let id
        try {
          await request(app)
            .post('/cases')
            .send(data)
            .set('Content-Type', 'application/json')
            .expect((res) => {
              id = res.body.id
            })
            .expect(201)
          const stored = await store.get(`cases/${id}`)
          expect(stored.data()).toEqual(data)
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
          expect(changed.data()).toEqual(data)
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
  describe('/reports', () => {
    describe('POST /reports', () => {
      it('persists data', async () => {
        const data = { foo: 'bar' }
        let result
        try {
          const start = moment().unix()
          await request(app)
            .post('/reports')
            .send(data)
            .set('Content-Type', 'application/json')
            .expect((res) => {
              result = res.body
              expect(result.id).toMatch(/^[\w\d]{6}$/)

              const createTime = moment(result.createTime).unix()
              expect(createTime).toBeGreaterThanOrEqual(start)
              expect(createTime).toBeLessThanOrEqual(moment().unix())
            })
            .expect(201)
          const stored = await store.get(`cases/${result.id}`)
          expect(stored.data()).toEqual(data)
        } finally {
          await store.remove(`cases/${result.id}`)
        }
      })
    })
    describe('GET /reports/:id', () => {
      it('retrieves data', async () => {
        const id = 'ABC123'
        const data = { foo: 'bar' }
        try {
          const start = moment().unix()
          await store.create(`cases/${id}`, data)
          await request(app)
            .get('/reports/abc123')
            .set('Accept', 'application/json')
            .expect((res) => {
              const result = res.body
              expect(result.id).toEqual(id)
              expect(result.data).toEqual(data)

              const createTime = moment(result.createTime).unix()
              expect(createTime).toBeGreaterThanOrEqual(start)
              expect(createTime).toBeLessThanOrEqual(moment().unix())
            })
            .expect(200)
        } finally {
          await store.remove('cases/ABC123')
        }
      })
      it('returns 404 if document does not exist', async () => {
        await request(app)
          .get('/reports/abc123')
          .set('Accept', 'application/json')
          .expect(404)
      })
    })
    describe('PUT /reports/:id', () => {
      it('updates data', async () => {
        const id = 'ABC123'
        const data = { foo: 'bar' }
        try {
          await store.create(`cases/${id}`, data)
          data.foo = 'baz'
          await request(app)
            .put('/reports/abc123')
            .send(data)
            .set('Content-Type', 'application/json')
            .expect(204)
          const changed = await store.get(`cases/${id}`)
          expect(changed.data()).toEqual(data)
        } finally {
          await store.remove('cases/ABC123')
        }
      })
      it('returns 404 if document does not exist', async () => {
        const data = { foo: 'bar' }
        await request(app)
          .put('/reports/abc123')
          .send(data)
          .set('Content-Type', 'application/json')
          .expect(404)
      })
    })
  })
  describe('/votes', () => {
    describe('POST /votes', () => {
      it('adds a vote', async () => {
        const data = { reportId: 'abc123', vote: 1 }
        let result
        try {
          await request(app)
            .post('/votes')
            .send(data)
            .set('Content-Type', 'application/json')
            .expect((res) => {
              result = res.body
              expect(result.id).toEqual(expect.any(String))
            })
            .expect(201)
          const stored = await store.get(`votes/${result.id}`)
          expect(stored.data()).toEqual(data)
        } finally {
          await store.remove(`votes/${result.id}`)
          await store.remove('stats/votes')
        }
      })
      it('updates aggregate', async () => {
        const votes = []
        try {
          // vote 1
          await request(app)
            .post('/votes')
            .send({ reportId: 'abc123', vote: 1 })
            .set('Content-Type', 'application/json')
            .then((res) => {
              votes.push(res.body.id)
            })
          // vote 2
          await request(app)
            .post('/votes')
            .send({ reportId: 'cde456', vote: -1 })
            .set('Content-Type', 'application/json')
            .then((res) => {
              votes.push(res.body.id)
            })
          // const aggregate = await store.get(`stats/votes`)
        } finally {
          await Promise.all(votes.map(id => store.remove(`votes/${id}`)))
          await store.remove('stats/votes')
        }
      })
    })
  })
})
