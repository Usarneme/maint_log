const supertest = require('supertest')

require('../../models/Log')
require('../../models/User')
require('../../models/Vehicle')

const { setupDB } = require('../setupTests')
setupDB('endpoint-testing')

const app = require('../../app')
app.set('port', process.env.PORT || 7777)
const request = supertest(app)

describe('Loading Express Server', () => {

  it('GET / route returns 200', async done => {
    const response = await request.get('/')
    expect(response).toEqual(expect.anything())
    expect(response.req.method).toEqual('GET')
    expect(response.res.statusCode).toEqual(200)
    done()
  })

})
