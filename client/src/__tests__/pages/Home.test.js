import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'

import Home from '../../pages/Home'

describe('HOME PAGE', () => {
  const props = {
    // "match": mockMatch,
    // "location": mockLocation,
    "history": {},
    "user": {
      "log": [
        {
          "name": "faker",
          "id": "fakeID"
        }
      ],
      "vehicle": [
        {
          "id": 0,
          "year": 1999,
          "make": "make",
          "model": "model"
        }
      ]
    },
    "updateUserState": () => {}
  }

  let raw
  beforeAll(() => {
    // Router wrap required as the Edit page calls the LogForm component which uses Links
    raw = TestRenderer.create(<Router><Home {...props} /></Router>)
  })

  it('Renders the Home Page', () => {
      expect(raw.toTree().rendered.rendered.type.name).toBe('Home')
      expect(raw.toJSON().children[1].props.className).toBe('home__actions__container')
  })

  it('Renders the body links (view full log, add, todo, search, settings)', () => {
    expect(raw.root.findAllByType(Link).length).toBe(5)
  })

  it('checks if the optional user.vehicle prop is provided', () => {
    expect(raw.toTree().rendered.rendered.props.user.vehicle).toStrictEqual(props.user.vehicle)
    expect(raw.toTree().rendered.rendered.rendered.rendered[0].props.vehicle).toStrictEqual(props.user.vehicle[0])
  })
})