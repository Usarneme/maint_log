const supertest = require('supertest')

require('../../models/Log')
require('../../models/User')
require('../../models/Vehicle')

const { setupDB } = require('../setupTests')
setupDB('endpoint-testing')

const app = require('../../app')
app.set('port', process.env.PORT || 7777)
const request = supertest(app)

describe('Testing Routes', () => {

  describe('Not Logged In', () => {
    it('GET / route returns 200', async done => {
      const response = await request.get('/')
      expect(response).toEqual(expect.anything())
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(200)
      done()
    })

    it('GET /login route returns 200', async done => {
      const response = await request.get('/login')
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(200)
      done()
    })

    it('GET /register route returns 200', async done => {
      const response = await request.get('/register')
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(200)
      done()
    })

    it('GET /log route returns 302 as user is not logged in', async done => {
      const response = await request.get('/log')
      expect(response.redirect).toBe(true)
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(302)
      done()
    })

    it('GET /add route returns 302 as user is not logged in', async done => {
      const response = await request.get('/add')
      expect(response.redirect).toBe(true)
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(302)
      done()
    })

    it('GET /upcoming-maintenance route returns 302 as user is not logged in', async done => {
      const response = await request.get('/upcoming-maintenance')
      expect(response.redirect).toBe(true)
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(302)
      done()
    })

    it('GET /account route returns 302 as user is not logged in', async done => {
      const response = await request.get('/account')
      expect(response.redirect).toBe(true)
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(302)
      done()
    })
  })

  describe('With A Valid User Logged In', () => {
    it('GET / route returns 200', async done => {
      const response = await request.get('/')
      expect(response).toEqual(expect.anything())
      expect(response.req.method).toEqual('GET')
      expect(response.res.statusCode).toEqual(200)
      done()
    })
  })
  
})

// get('/log/page/:page
// post('/add',
// post('/add/:id',
// get('/log/:id/edit
// get('/log/:slug',
// post('/register'
// get('/logout'
// post('/account'