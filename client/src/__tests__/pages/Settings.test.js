import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'

import Settings from '../../pages/Settings'

describe('SETTINGS PAGE', () => {
  let raw

  const mockLocation = {
    pathname: '/settings',
    hash: '',
    search: '',
    state: '',
    params: {}
  }
  const mockMatch = {
    "path":"/settings",
    "url":"/settings",
    "isExact":true,
    "params":{}
  }

  const mockUser = {
    "log": [
      {
        "tools":["Socket wrench"],
        "parts":["None"],
        "receipts":[""],
        "photos":["1d124d0b-6495-4c17-8145-1d2d5dbbcbde.jpeg","e0e09d60-16e5-4f2a-b60a-c8eeff05eed7.jpeg"],
        "_id":"5e8665eba57e6978dbc",
        "name":"Door latches refurb",
        "vehicle":"5e4cee3fd2ebbc8f5e6",
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
        "author":"5e3ce3f10ac0bc29266",
        "dateEntered":"2020-04-02T00:00:00.000Z",
        "slug":"door-latches-refurb",
        "__v":0,
        "id":"abc123"
      },
      {
        "name": "faker",
        "id": "fakeID"
      }
    ],
    "vehicle": [
      {
        "id": 0,
        "year": 2020,
        "make": "Tesla",
        "model": "Model X",
        "odometer": 150,
        "mileageHistory": [],
        "vin": "teslavinforreal123" 
      }
    ]
  }
  const props = {
    "match": mockMatch,
    "location": mockLocation,
    "history": {},
    "user": mockUser,
    "updateUserState": () => {}
  }

  beforeEach(() => {
    raw = TestRenderer.create(<Router><Settings {...props} /></Router>)
  })

  it('Renders', () => {
    expect(raw.toTree().rendered.rendered.type.name).toBe('Settings')
  })

  it('Contains four components: vehicle, account, theme, and logout', () => {
    expect(raw.toTree().rendered.rendered.rendered.props.children[1].props.children[0].props.children).toBe('Vehicle')
    expect(raw.toTree().rendered.rendered.rendered.props.children[2].props.children[0].props.children).toBe('Account')
    expect(raw.toTree().rendered.rendered.rendered.props.children[3].props.children[0].props.children).toBe('Theme Settings')
    expect(raw.toTree().rendered.rendered.rendered.props.children[4].props.children[0].props.children).toBe('Disconnect Account and Logout')
  })
  // Components: Vehicle, Account, Theme, and Logout
})