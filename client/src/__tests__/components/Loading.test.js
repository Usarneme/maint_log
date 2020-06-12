import React from 'react'
import TestRenderer from 'react-test-renderer'

import Loading from '../../components/Loading'

describe('LOADING COMPONENT', () => {
  it('returns null when the component is called without a message prop', () => {
    const raw = TestRenderer.create(<Loading />)
    expect(raw.toJSON()).toBe(null)
    expect(raw.toTree().instance).toBe(null)
    expect(raw.toTree().rendered).toBe(null)
    expect(raw.root.instance).toBe(null)
    expect(raw.root._fiber.child).toBe(null)
  })
  it('renders the component when called with a valid message prop', () => {
    const testMessage = 'TEST LOADING MSG'
    const raw = TestRenderer.create(<Loading message={testMessage} />)
    expect(raw.toJSON().children[0]).toEqual(testMessage)
    expect(raw.toTree().rendered.props.children).toEqual(testMessage)
    expect(raw.root._fiber.child).not.toBe(null)
  })
})