import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'

import Todo from '../../pages/Todo'

describe('TODO PAGE', () => {
  const userProps = {
    "cookies": "abc123",
    "email": "email@address.com",
    "log": [
      {"_id": 0, "mileageDue": 5, "dateDue": null},
      {"_id": 1, "mileageDue": null, "dateDue": null}],
    "name": "username",
    "vehicle": [{"vehicle0": { "odometer": 1 }}]
  }

it('** The Todo Page renders', () => {
    // Router is required in order to render Link tags (within LogEntry rendered/called by Log)
    const raw = TestRenderer.create(
      <Router>
        <Todo user={userProps} updateUserState={() => {}} />
      </Router>
    )
    const tree = raw.toTree()
    expect(tree.instance).not.toBe(null)
    expect(tree.props.children.props.user).toEqual(userProps)
    expect(raw.toJSON().children[0].children[0]).toEqual('Upcoming Service')
    expect(raw.toJSON().children[1].children.length).toBe(3) // vehicleHeader + log__sorter + number of future due log entries 
  })

  const noTodosProps = {
    "cookies": "abc123",
    "email": "email@address.com",
    "log": [
      {"_id": 0, "mileageDue": null, "dateDue": null},
      {"_id": 1, "mileageDue": null, "dateDue": null}],
    "name": "username",
    "vehicle": [{"vehicle0": { "odometer": 1 }}]
  }

  it('Renders alternate text when there are no future due log entries', () => {
    const raw = TestRenderer.create(
      <Router>
        <Todo user={noTodosProps} updateUserState={() => {}} />
      </Router>
    )
    expect(raw.toJSON().children[1].props.className).toBe('card no__todos')
    expect(raw.toTree().props.children.props.user).toEqual(noTodosProps)
    expect(raw.toJSON().children[1].children.length).toBe(3) // header and 2 anchor tag2 )links to /add and /log)
    expect(raw.toJSON().children[1].children[0].children[0]).toBe('No Future-Due Log Entries Found!')
    expect(raw.toJSON().children[1].children[1].props.href).toBe('/add')
    expect(raw.toJSON().children[1].children[2].props.href).toBe('/log')
  })
})
