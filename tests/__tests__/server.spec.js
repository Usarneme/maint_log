const supertest = require('supertest')

require('../models/Log')
require('../models/User')
require('../models/Vehicle')

const { setupDB } = require('../test-setup')
setupDB('endpoint-testing')

const app = require('../app')
app.set('port', process.env.PORT || 7777)
const request = supertest(app)

describe('Loading Express Server', () => {

  it('responds to /', async done => {
    const response = await request.get('/')
    expect(response).toEqual(expect.anything())
    done()
  })

})
