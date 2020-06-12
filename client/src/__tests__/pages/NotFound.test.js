import React from 'react'
import TestRenderer from 'react-test-renderer'

import AppRouter from '../../AppRouter'
import NotFound from '../../pages/NotFound'

describe('NOT FOUND PAGE', () => {
  it('** Responds with a redirect to /welcome', () => {
    const raw = TestRenderer.create(
      <AppRouter>
        <NotFound />
      </AppRouter>
    )
    expect(raw.toJSON()[1].children[0].props.className).toEqual('card guest__options')
    expect(raw.toTree().rendered.instance.history.action).toEqual('REPLACE')
    expect(raw.toTree().rendered.instance.history.location.pathname).toEqual('/welcome')
  })
})
