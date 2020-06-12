import React from 'react'
import TestRenderer from 'react-test-renderer'
import { BrowserRouter as Router } from 'react-router-dom'

import SingleLogEntry from '../../pages/SingleLogEntry'

describe('SINGLE LOG ENTRY PAGE', () => {
  const mockMatch = {
    "path":"/log/:id/edit",
    "url":"/log/abc123/edit",
    "isExact":true,
    "params":{"id":"abc123","slug":"abc123"}
  }
  const mockLocation = {
    pathname: '/log/abc123/edit',
    hash: '',
    search: '',
    state: '',
    params: {
      'id': 'abc123',
      'slug': 'abc123'
    }
  }
  const props = {
    "match": mockMatch,
    "location": mockLocation,
    "history": {},
    "user": {
      "log": [
        {
          "tools":["Socket wrench, 1/2\" socket, screwdriver, WD40, Tri-flow, brakleen, shop towels, gloves"],
          "parts":["None"],
          "receipts":[""],
          "photos":["1d124d0b-6495-4c17-8145-1d2d5dbbcbde.jpeg","96b45924-a322-4560-a8df-4a2a6dc016fa.jpeg","e0e09d60-16e5-4f2a-b60a-c8eeff05eed7.jpeg"],
          "_id":"abc123",
          "name":"Door latches refurb",
          "vehicle":"5e4cee3fd2ebbc8f5e62f214",
          "dateStarted":"2020-03-11T00:00:00.000Z",
          "dateCompleted":"2020-04-01T00:00:00.000Z",
          "dateDue":null,
          "mileageDue":null,
          "shortDescription":"Removed, degreased, cleaned, lubricated, and re-installed the door latches.",
          "longDescription":"Reinstall.",
          "partsCost":0,
          "laborCost":0,
          "serviceLocation":"Self",
          "odometer":219994,
          "author":"5e3ce3f10ac0bc29266d5287",
          "dateEntered":"2020-04-02T00:00:00.000Z",
          "slug":"abc123",
          "__v":0,
          "id":"abc123"
        },
        {
          "tools":["Socket"],
          "parts":["None"],
          "receipts":[""],
          "photos":["1d124d0b"],
          "_id":"xyz789",
          "name":"Door",
          "vehicle":"5e4cee3fd2ebbc8f5e62f214",
          "dateStarted":"2020",
          "dateCompleted":"2020",
          "dateDue":null,
          "mileageDue":null,
          "shortDescription":"Removed",
          "longDescription":"Reinstall",
          "partsCost":0,
          "laborCost":0,
          "serviceLocation":"Self",
          "odometer":219994,
          "author":"5e3ce3f10ac0bc29266d5287",
          "dateEntered":"2020",
          "slug":"test-two",
          "__v":0,
          "id":"xyz789"
        }
      ]
    },
    "updateUserState": () => {}
  }

  it('** Renders the Edit Page', () => {
    const raw = TestRenderer.create(<Router><SingleLogEntry {...props} /></Router>)
    expect(raw.toTree().rendered.rendered.type.name).toBe('SingleLogEntry')
  })

  it('** Gets the log slug from the url params', () => {
    const raw = TestRenderer.create(<Router><SingleLogEntry {...props} /></Router>)
    expect(raw.toTree().rendered.rendered.props).toStrictEqual(props)
    expect(raw.toTree().rendered.rendered.rendered.props.children[0].props.children).toBe(props.user.log[0].name)
  })
})