import React from 'react'
import TestRenderer from 'react-test-renderer'

import Search from '../../pages/Search'

describe('SEARCH PAGE', () => {
  const userProps = {
    "cookies": "abc123",
    "email": "email@address.com",
    "log": [{"_id": 0},{"_id": 1}],
    "name": "username",
    "vehicle": [{"vehicle0": {}}],
    "sessionID": "sessionIDblahblah",
    "userID": "userIDblahblahblah"
  }
  it('Renders correctly with a proper user object passed as props', () => {
    const raw = TestRenderer.create(
      <Search user={userProps} />
    )
    expect(raw.toTree().rendered).not.toBe(null)
    expect(raw.root._fiber.child).not.toBe(null)
    expect(raw.root._fiber.child.stateNode.props.className).toBe('inner')
  })
})