import React from 'react'
import PropTypes from 'prop-types'
// import { CSSTransition } from 'react-transition-group'

import '../styles/loading.css'

function Loading(props) {
  if (!props || !props.message) return null

  return (
      <div className="loading">
        <div className="lds-grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          {props.message.charAt(0).toUpperCase() + props.message.slice(1)}          
        </div>
      </div>
  )
}

Loading.propTypes = {
  message: PropTypes.string.isRequired
}

export default Loading