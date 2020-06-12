import React from 'react'
import TestRenderer from 'react-test-renderer'
import { BrowserRouter as Router } from 'react-router-dom'

import Edit from '../../pages/Edit'

describe('EDIT PAGE', () => {
  const mockLocation = {
    pathname: '/log/abc123/edit',
    hash: '',
    search: '',
    state: '',
    params: {
      'id': 'abc123'
    }
  }
  const mockMatch = {
    "path":"/log/:id/edit",
    "url":"/log/abc123/edit",
    "isExact":true,
    "params":{"id":"abc123"}
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
          "_id":"5e8665eba57e6978dbcfcafa",
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
          "slug":"door-latches-refurb",
          "__v":0,
          "id":"abc123"
        },
        {
          "name": "faker",
          "id": "fakeID"
        }
      ]
    },
    "updateUserState": () => {}
  }

  let raw
  beforeAll(() => {
    // Router wrap required as the Edit page calls the LogForm component which uses Links
    raw = TestRenderer.create(<Router><Edit {...props} /></Router>)
  })

  it('** Renders the Edit Page', () => {
    expect(raw.toTree().rendered.rendered.type.name).toBe('Edit')
  })

  it('** Gets the log ID from the url params', () => {
    expect(raw.toTree().rendered.rendered.rendered.props.log.id).toEqual(props.user.log[0].id)
    expect(raw.root._fiber.child.child.return.return.memoizedProps.children.props).toStrictEqual(props)
    expect(raw.root._fiber.child.child.return.return.memoizedProps.children.props.user.log[0].id).toEqual(props.user.log[0].id)
  })

  it('** Contains the correct props', () => {
    expect(raw.toTree().rendered.rendered.props).toStrictEqual(props)
  })

  it('** Contains a LogForm component as a child', () => {
    expect(raw.toTree().rendered.rendered.rendered.type.name).toBe('LogForm')
  })

  it('** Passes the correct props to the child', () => {
    const propsWithLog = { ...props, log: {...props.user.log[0]} }
    expect(raw.toTree().rendered.rendered.rendered.props).toStrictEqual(propsWithLog)
  })
})
