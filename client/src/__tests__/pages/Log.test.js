import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'

import Log from '../../pages/Log'
import LogSorter from '../../components/log/LogSorter'

describe('LOG PAGE', () => {
  const userProps = {
    "cookies": "abc123",
    "email": "email@address.com",
    "log": [{"_id": 0},{"_id": 1}],
    "name": "username",
    "vehicle": [{"vehicle0": {}}]
  }

it('** The Log Page renders', () => {
    // Router is required in order to render Link tags (within LogEntry rendered/called by Log)
    const raw = TestRenderer.create(
      <Router>
        <Log user={userProps} updateUserState={() => {}} />
      </Router>
    )
    const tree = raw.toTree()
    expect(tree.instance).not.toBe(null)
    expect(tree.props.children.props.user).toEqual(userProps)
    expect(raw.toJSON().children[0].children[0]).toEqual('Service History')
    expect(raw.toJSON().children[1].children.length).toBe(2+userProps.log.length) // vehicleHeader + log__sorter + number of entries 
    expect(raw.root.findByType(LogSorter)._fiber.pendingProps.user).toStrictEqual(userProps)
  })

  const noLogProps = {
    "cookies": "abc123",
    "email": "email@address.com",
    "log": [],
    "name": "username",
    "vehicle": [{"vehicle0": {}}]
  }

  it('Renders text and button when there are no log entries', () => {
    const raw = TestRenderer.create(
      <Router>
        <Log user={noLogProps} updateUserState={() => {}} />
      </Router>
    )
    expect(raw.toJSON().children[1].props.className).toBe('card no__log')
    expect(raw.toTree().props.children.props.user).toEqual(noLogProps)
    expect(raw.toJSON().children[1].children.length).toBe(2) // header and anchor tag link to add new log entry
    expect(raw.toJSON().children[1].children[0].children[0]).toBe('No Log Entries Found!')
    expect(raw.toJSON().children[1].children[1].props.href).toBe('/add')
    expect(raw.toJSON().children[1].children[1].props.className).toBe('button')
  })

})
